import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import {
  InternalServerErrorException,
  OnModuleDestroy,
  OnModuleInit,
  UnauthorizedException,
  UseFilters,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { AuthService } from '../auth/auth.service';
import { UsersService } from '../users/users.service';
import { User } from 'src/users/model/user/user.entity';
import { ConnectedUserService } from './services/connected-user.service';
import { ChannelService } from './services/channel.service';
import { JoinedChannelService } from './services/joined-channel.service';
import { MessageService } from './services/message.service';
import { ChannelUserService } from './services/channel-user.service';
import { Mode } from './model/connected-user/mode.enum';
import { WsExceptionFilter } from './ws.exception';
import { IChannel } from './model/channel/channel.interface';
import { JoinChannelDto } from './dtos/join-channel.dto';
import { IUser } from 'src/users/model/user/user.interface';
import { IChannelUser } from './model/channel-user/channel-user.interface';
import { State } from './interface/state.enum';
import { scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { IMessage } from './model/message/message.interface';
import { UpdateChannelDto } from './dtos/update-channel.dto';
import { IDiscussion } from './interface/discussion.interface';
import { IUpdateAdmin } from './interface/update-admin.interface';
import { IUpdateUser } from './interface/update-user.interface';
import { CreateChannelDto } from './dtos/create-channel.dto';

const scrypt = promisify(_scrypt);

@UsePipes(new ValidationPipe())
@UseFilters(WsExceptionFilter)
@WebSocketGateway({
  namespace: '/chat',
  cors: {
    origin: ['http://localhost:8080'],
    credentials: true,
  },
})
export class ChatGateway
  implements
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnModuleInit,
    OnModuleDestroy
{
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly channelService: ChannelService,
    private readonly connectedUserService: ConnectedUserService,
    private readonly joinedChannelService: JoinedChannelService,
    private readonly messageService: MessageService,
    private readonly channelUserService: ChannelUserService,
  ) {}

  async onModuleInit() {
    await this.connectedUserService.deleteAll();
    await this.joinedChannelService.deleteAll();
  }

  async onModuleDestroy() {
    await this.connectedUserService.deleteAll();
    await this.joinedChannelService.deleteAll();
  }

  /** ---------------------------  CONNECTION  -------------------------------- */

  async handleConnection(socket: Socket) {
    try {
      const decodedToken = await this.authService.verifyJwt(
        socket.handshake.headers.authorization,
      );
      const user: User = await this.usersService.findUser(decodedToken.sub);
      if (!user) {
        return this.disconnect(socket);
      } else {
        socket.data.user = user;
        const channels = await this.channelService.getChannels(user.id);
        await this.connectedUserService.deleteByUser(user);
        await this.connectedUserService.create({
          socketId: socket.id,
          user,
          mode: Mode.chat,
        });
        // const discussion =
        // await this.channelService.getChannelsDiscussionForUser(user.id);
        // console.log('connect discussion', discussion);
        // console.log('connect discussion user', discussion[0].users);
        // this.server.to(socket.id).emit('discussion', discussion);
        this.server.to(socket.id).emit('channels', channels);
      }
    } catch (e) {
      return this.disconnect(socket);
    }
  }

  async handleDisconnect(socket: Socket) {
    if (socket.data.user) {
      await this.connectedUserService.deleteByUser(socket.data.user);
      await this.joinedChannelService.deleteBySocketId(socket.id);
    }
    socket.disconnect();
  }

  private handleError(socket: Socket, message: string) {
    socket.emit('Error', new InternalServerErrorException(message));
    throw new WsException(message);
  }

  private disconnect(socket: Socket) {
    socket.emit('Error', new UnauthorizedException());
    socket.disconnect();
  }

  /** ---------------------------  CHANNEL -------------------------------- */

  private async sendChannelToEveryone(userId: number) {
    const channels = await this.channelService.getChannels(userId);
    if (channels) {
      const connectedUsers = await this.connectedUserService.getAll();
      for (const user of connectedUsers) {
        this.server.to(user.socketId).emit('channels', channels);
      }
    }
  }

  private async switchToChannel(socket: Socket, channel: IChannel) {
    await this.joinedChannelService.deleteBySocketId(socket.id);

    await this.joinedChannelService.create({
      socketId: socket.id,
      user: socket.data.user,
      channelId: channel.id,
    });

    // Filter messages
    const messages = await this.messageService.findMessageByChannel(channel);
    const messagesFiltered = messages.filter((message) => {
      const userBlockedMe = socket.data.user?.blockedUsers?.find(
        (blockedUser: any) => blockedUser.id === message.user.id,
      );
      if (!userBlockedMe) {
        return message;
      }
    });
    this.server.to(socket.id).emit('messages', messagesFiltered);

    await this.updateCurrentChannel(channel.id);

    const channels = await this.channelService.getChannels(
      socket?.data?.user?.id,
    );
    return this.server.to(socket.id).emit('channels', channels);
  }

  private async updateCurrentChannel(channelId: number) {
    const channelUpdated = await this.channelService.getChannel(channelId);
    const joinedChannelUsers = await this.joinedChannelService.findByChannel(
      channelId,
    );
    if (joinedChannelUsers) {
      for (const joinedChannelUser of joinedChannelUsers) {
        this.server
          .to(joinedChannelUser.socketId)
          .emit('currentChannel', channelUpdated);
      }
    }
  }

  private async getChannelAndUser(
    channel: IChannel,
    user: IUser,
  ): Promise<[IChannel, IChannelUser]> {
    if (!channel || !channel.id) return [null, null];
    const channelDB = await this.channelService.getChannel(channel.id);
    const channelUser = await this.channelUserService.findUserInChannel(
      channelDB.id,
      user,
    );
    return [channelDB, channelUser];
  }

  @SubscribeMessage('createDiscussion')
  async onCreateDiscussion(socket: Socket, discussion: IDiscussion) {
    if (socket.data.user === undefined) return;
    // const channel = await this.channelService.getChannelByName(
    //   discussion.channel.name,
    // );
    const channel = await this.channelService.getDiscussion(
      socket.data.user.id,
      discussion.user.id,
    );
    console.log('channel', channel);
    if (channel) {
      this.handleError(socket, 'channel already exist');
    }
    const createdChannel = await this.channelService.createChannel(
      discussion.channel,
    );
    if (!createdChannel) {
      this.handleError(socket, 'impossible to create discussion');
    }
    const channelUser = await this.channelUserService.createUser({
      administrator: true,
      creator: true,
      ban: false,
      mute: false,
      user: socket.data.user,
      channelId: createdChannel.id,
      channel: createdChannel,
    });
    if (!channelUser) {
      await this.channelService.deleteChannelById(createdChannel.id);
      this.handleError(socket, 'impossible to create user in discussion');
    }
    const channelUserInvite = await this.channelUserService.createUser({
      administrator: false,
      creator: false,
      ban: false,
      mute: false,
      user: discussion.user,
      channelId: createdChannel.id,
      channel: createdChannel,
    });
    if (!channelUserInvite) {
      await this.channelService.deleteChannelById(createdChannel.id);
      await this.channelUserService.deleteUserInChannel(
        createdChannel.id,
        channelUser.user,
      );
      this.handleError(socket, 'impossible to create user in discussion');
    }
    const updateChannel = await this.channelService.updateWithSaveChannel(
      createdChannel,
      { users: [channelUser, channelUserInvite] },
    );
    console.log('updateChannel', updateChannel);
    if (!updateChannel) {
      await this.channelService.deleteChannelById(createdChannel.id);
      await this.channelUserService.deleteUserInChannel(
        createdChannel.id,
        channelUser.user,
      );
      await this.channelUserService.deleteUserInChannel(
        createdChannel.id,
        channelUserInvite.user,
      );
      this.handleError(socket, 'impossible to update discussion');
    }
    for (const user of updateChannel.users) {
      const connectedUsers = await this.connectedUserService.findByUserAndMode(
        user.user,
        Mode.chat,
      );
      if (connectedUsers) {
        this.server
          .to(connectedUsers.socketId)
          .emit('newDiscussion', updateChannel);
      }
    }
    await this.switchToChannel(socket, updateChannel);
  }

  @SubscribeMessage('createChannel')
  async onCreateChannel(socket: Socket, channel: CreateChannelDto) {
    if (socket.data.user === undefined) return;
    const channelExist = await this.channelService.getChannelByName(
      channel.name,
    );
    if (channelExist) {
      this.handleError(socket, 'channel name already exist');
    }
    const createdChannel: IChannel = await this.channelService.createChannel(
      channel,
    );
    if (!createdChannel) {
      this.handleError(socket, 'impossible to create discussion');
    }
    const channelUser = await this.channelUserService.createUser({
      administrator: true,
      creator: true,
      ban: false,
      mute: false,
      user: socket.data.user,
      channelId: createdChannel.id,
      channel: createdChannel,
    });
    if (!channelUser) {
      await this.channelService.deleteChannelById(createdChannel.id);
      this.handleError(socket, 'impossible to create user in discussion');
    }
    const updatedChannel = await this.channelService.updateWithSaveChannel(
      createdChannel,
      {
        users: [channelUser],
      },
    );
    if (!updatedChannel) {
      await this.channelService.deleteChannelById(createdChannel.id);
      await this.channelUserService.deleteUser(channelUser);
      this.handleError(socket, 'impossible to update user owner in discussion');
    }
    await this.sendChannelToEveryone(socket.data.user.id);
    await this.switchToChannel(socket, updatedChannel);
  }

  @SubscribeMessage('removeChannel')
  async onRemoveChannel(socket: Socket, channel: IChannel) {
    if (socket.data.user === undefined) return;
    const channelDB = await this.channelService.getChannel(channel.id);
    if (!channelDB) {
      this.handleError(socket, 'channel not found');
    }
    await this.channelUserService.deleteAllUsersInChannel(channelDB.id);
    await this.joinedChannelService.deleteByChannel(channelDB);
    await this.channelService.deleteChannelById(channelDB.id);
    await this.sendChannelToEveryone(socket.data.user.id);
  }

  @SubscribeMessage('joinChannel')
  async onJoinChannel(socket: Socket, joinChannel: JoinChannelDto) {
    if (socket.data.user === undefined) return;
    if (joinChannel.channel === undefined || joinChannel.channel === null) {
      this.handleError(socket, 'channel id not found');
    }
    const channelDB = await this.channelService.getChannelWithPassword(
      joinChannel.channel.id,
    );
    if (!channelDB) {
      this.handleError(socket, 'channel not found');
    }
    const user = await this.channelUserService.findUserInChannel(
      channelDB.id,
      socket.data.user,
    );
    if (!user) {
      if (channelDB.state === State.private) {
        this.handleError(socket, 'impossible to join private discussion');
      }
      if (channelDB.state === State.protected) {
        if (!channelDB.password) {
          this.handleError(socket, 'channel does not have a password');
        }
        const [salt, storedHash] = channelDB.password.split('.');
        const hash = (await scrypt(joinChannel.password, salt, 64)) as Buffer;
        if (hash.toString('hex') !== storedHash) {
          this.handleError(socket, 'wrong password');
        }
      }
      const newUser = await this.channelUserService.createUser({
        administrator: false,
        creator: false,
        ban: false,
        mute: false,
        user: socket.data.user,
        channelId: channelDB.id,
        channel: channelDB,
      });
      await this.channelService.addUser(channelDB, newUser);
      const newChannelDB = await this.channelService.getChannel(channelDB.id);
      await this.switchToChannel(socket, newChannelDB);
    } else {
      if (user.ban === true) {
        if (this.countdownIsDown(user.unban_at) === false) {
          this.handleError(socket, 'user is banned');
        }
        await this.channelUserService.updateUser(user, {
          ban: false,
          unban_at: null,
        });
      }
      await this.switchToChannel(socket, channelDB);
    }
  }

  @SubscribeMessage('leaveChannel')
  async onLeaveChannel(socket: Socket, channel: IChannel) {
    if (socket.data.user === undefined) return;
    const [channelDB, channelUser] = await this.getChannelAndUser(
      channel,
      socket.data.user,
    );
    if (!channelDB) {
      this.handleError(socket, 'channel not found');
    }
    if (!channelUser) {
      this.handleError(socket, 'user not found');
    }

    await this.joinedChannelService.deleteBySocketId(socket.id);
    await this.channelUserService.deleteUser(channelUser);

    const users = await this.channelUserService.getUsersInChannel(channelDB);
    if (users.length === 0) {
      await this.channelUserService.deleteAllUsersInChannel(channelDB.id);
      await this.messageService.deleteMessageByChannel(channelDB);
      await this.channelService.deleteChannelById(channelDB.id);
      return this.sendChannelToEveryone(socket.data.user.id);
    } else if (channelUser.creator === true) {
      const admins = await this.channelUserService.getAdminsInChannel(
        channelDB,
      );
      if (admins && admins.length > 0) {
        await this.channelUserService.updateUser(admins[0], { creator: true });
      } else {
        await this.channelUserService.updateUser(users[0], {
          creator: true,
          administrator: true,
        });
      }
    }
    const channels = await this.channelService.getChannels(socket.data.user.id);
    this.server.to(socket.id).emit('channels', channels);
    return this.updateCurrentChannel(channelDB.id);
  }

  @SubscribeMessage('getAllChannels')
  async getAllChannels(socket: Socket) {
    if (socket.data.user === undefined) return;
    const channels = await this.channelService.getChannels(
      socket?.data?.user?.id,
    );
    return this.server.to(socket.id).emit('channels', channels);
  }

  @SubscribeMessage('getChannels')
  async getChannels(socket: Socket) {
    if (socket.data.user === undefined) return;
    const channels = await this.channelService.getChannelsForUser(
      socket.data?.user?.id,
    );
    return this.server.to(socket.id).emit('channels', channels);
  }

  @SubscribeMessage('changeChannelState')
  async onChangeChannelState(socket: Socket, updateChannel: UpdateChannelDto) {
    if (socket.data.user === undefined) return;
    const channel = await this.channelService.getChannel(updateChannel.id);
    if (!channel) {
      this.handleError(socket, 'channel not found');
    }
    const user = await this.channelUserService.findUserInChannel(
      channel.id,
      socket.data.user,
    );
    if (!user) {
      this.handleError(socket, 'user not found');
    }
    if (user.creator === false) {
      this.handleError(socket, 'user does not have the rights');
    }
    if (updateChannel.state === State.protected) {
      if (updateChannel.password === undefined) {
        this.handleError(socket, 'protected channel without password');
      }
      updateChannel.password = await this.channelService.hashPassword(
        updateChannel.password,
      );
    }
    const attrs: { state: number; password?: string } = {
      state: updateChannel.state,
    };
    if (attrs.state === State.protected) {
      attrs.password = updateChannel.password;
    }
    await this.channelService.updateChannel(channel, attrs);
    await this.sendChannelToEveryone(socket.data.user.id);
    await this.updateCurrentChannel(channel.id);
  }

  /** ---------------------------  MESSAGE  -------------------------------- */

  @SubscribeMessage('addMessage')
  async onAddMessage(socket: Socket, message: IMessage) {
    if (socket.data.user === undefined) return;
    const [channel, user] = await this.getChannelAndUser(
      message.channel,
      socket.data.user,
    );
    if (!channel) {
      this.handleError(socket, 'channel not found');
    }
    if (!user) {
      this.handleError(socket, 'user not found');
    }
    if (user.mute === true) {
      if (this.countdownIsDown(user.unmute_at) === false) {
        this.handleError(socket, 'user is mute');
      }
      await this.channelUserService.updateUser(user, {
        mute: false,
        unmute_at: null,
      });
    }
    if (user.ban === true) {
      if (this.countdownIsDown(user.unban_at) === false) {
        this.handleError(socket, 'user is ban');
      }
      await this.channelUserService.updateUser(user, {
        ban: false,
        unban_at: null,
      });
    }
    const createdMessage = await this.messageService.create({
      ...message,
      user: socket.data.user,
    });
    const joinedUsers = await this.joinedChannelService.findByChannel(
      channel.id,
    );
    if (joinedUsers) {
      for (const joinedUser of joinedUsers) {
        const userBlockedMe = joinedUser.user.blockedUsers.find(
          (blockedUser) => blockedUser.id === user.user.id,
        );
        if (userBlockedMe === undefined) {
          this.server
            .to(joinedUser.socketId)
            .emit('messageAdded', createdMessage);
        }
      }
    }
  }

  //   /** ---------------------------  ADMINISTRATOR  -------------------------------- */

  private async checkRightsAndFindUser(
    socket: Socket,
    user: IUser,
    channel: IChannel,
    target: IUser,
  ): Promise<IChannelUser> {
    const [channelDB, userDB] = await this.getChannelAndUser(channel, user);
    if (!channelDB) {
      this.handleError(socket, 'channel not found');
    }
    if (!userDB) {
      this.handleError(socket, 'user not found in the channel');
    }
    if (userDB.administrator === false) {
      this.handleError(socket, 'user does not have the rights');
    }
    const newAdminUser = await this.channelUserService.findUserInChannel(
      channelDB.id,
      target,
    );
    if (!newAdminUser) {
      this.handleError(socket, 'user target not found');
    }
    return newAdminUser;
  }

  @SubscribeMessage('addAdministrator')
  async addingUserToAdministrator(socket: Socket, newAdmin: IUpdateAdmin) {
    if (socket.data.user === undefined) return;
    const target = await this.checkRightsAndFindUser(
      socket,
      socket.data.user,
      newAdmin.channel,
      newAdmin.user,
    );
    await this.channelUserService.updateUser(target, {
      administrator: true,
    });
  }

  @SubscribeMessage('removeAdministrator')
  async removeUserToAdministrator(socket: Socket, removeAdmin: IUpdateAdmin) {
    if (socket.data.user === undefined) return;
    const target = await this.checkRightsAndFindUser(
      socket,
      socket.data.user,
      removeAdmin.channel,
      removeAdmin.user,
    );
    await this.channelUserService.updateUser(target, { administrator: false });
  }

  /** ---------------------------  BAN / MUTE  -------------------------------- */

  private countdownIsDown(countdown: Date): boolean {
    const now = new Date();
    return now >= countdown;
  }

  private async getTargetAndSecureRights(
    socket: Socket,
    channel: IChannel,
    target: IUser,
    user: IUser,
  ) {
    const [channelDB, userDB] = await this.getChannelAndUser(channel, user);
    if (!channelDB) {
      this.handleError(socket, 'channel not found');
    }
    if (!userDB) {
      this.handleError(socket, 'user not found');
    }
    if (userDB.administrator === false) {
      this.handleError(socket, 'user does not have the rights');
    }
    const targetDB = await this.channelUserService.findUserInChannel(
      channel.id,
      target,
    );
    if (!targetDB) {
      this.handleError(socket, 'user target not found');
    }
    return targetDB;
  }

  @SubscribeMessage('banUser')
  async onBanUser(socket: Socket, banUser: IUpdateUser) {
    if (socket.data.user === undefined) return;
    const target = await this.getTargetAndSecureRights(
      socket,
      banUser.channel,
      banUser.user,
      socket.data.user,
    );
    if (socket.data.user.id === banUser.user.id) {
      this.handleError(socket, 'impossible to ban yourself');
    }
    const now = new Date();
    await this.channelUserService.updateUser(target, {
      ban: true,
      unban_at: new Date(now.getTime() + banUser.milliseconds),
    });

    const bannedUser = await this.connectedUserService.findByUserAndMode(
      target.user,
      Mode.chat,
    );
    if (bannedUser) {
      this.server.to(bannedUser.socketId).emit('currentChannel', null);
      this.server.to(bannedUser.socketId).emit('messages', []);
    }
    const joinedChannel = await this.joinedChannelService.findByUserAndChannel(
      banUser.channel,
      target.user,
    );
    if (joinedChannel) {
      await this.joinedChannelService.delete(joinedChannel);
    }
    await this.updateCurrentChannel(banUser.channel.id);
  }

  @SubscribeMessage('unbanUser')
  async onUnbanUser(socket: Socket, unbanUser: IUpdateUser) {
    if (socket.data.user === undefined) return;
    const target = await this.getTargetAndSecureRights(
      socket,
      unbanUser.channel,
      unbanUser.user,
      socket.data.user,
    );
    if (target.ban === false) {
      this.handleError(socket, 'user is not banned');
    }
    if (socket.data.user.id === unbanUser.user.id) {
      this.handleError(socket, 'impossible to unban yourself');
    }
    await this.channelUserService.updateUser(target, {
      ban: false,
      unban_at: null,
    });
  }

  @SubscribeMessage('muteUser')
  async onMuteUser(socket: Socket, muteUser: IUpdateUser) {
    if (socket.data.user === undefined) return;
    const target = await this.getTargetAndSecureRights(
      socket,
      muteUser.channel,
      muteUser.user,
      socket.data.user,
    );
    if (socket.data.user.id === muteUser.user.id) {
      this.handleError(socket, 'impossible to mute yourself');
    }
    const now = new Date();
    await this.channelUserService.updateUser(target, {
      mute: true,
      unmute_at: new Date(now.getTime() + muteUser.milliseconds),
    });
  }

  @SubscribeMessage('unmuteUser')
  async onUnmuteUser(socket: Socket, unmuteUser: IUpdateUser) {
    if (socket.data.user === undefined) return;
    const target = await this.getTargetAndSecureRights(
      socket,
      unmuteUser.channel,
      unmuteUser.user,
      socket.data.user,
    );
    if (target.mute === false) {
      this.handleError(socket, 'user is not muted');
    }
    if (socket.data.user.id === unmuteUser.user.id) {
      this.handleError(socket, 'impossible to unmute yourself');
    }
    await this.channelUserService.updateUser(target, {
      mute: false,
      unmute_at: null,
    });
  }

  @SubscribeMessage('getBannedUsers')
  async getBannedUsers(socket: Socket, channel: IChannel) {
    if (socket.data.user === undefined) return;
    const [channelDB, userDB] = await this.getChannelAndUser(
      channel,
      socket.data.user,
    );
    if (!channelDB) {
      this.handleError(socket, 'channel not found');
    }
    if (!userDB) {
      this.handleError(socket, 'user not found');
    }
    if (userDB.administrator === false) {
      this.handleError(
        socket,
        'only administrator can access of the banned users',
      );
    }
    const bannedUsers = await this.channelUserService.getBannedUsersInChannel(
      channelDB,
    );
    this.server
      .to(socket.id)
      .emit('bannedUsers', bannedUsers ? bannedUsers : []);
  }
}
