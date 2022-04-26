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
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { IMessage } from './model/message/message.interface';
import { UpdateChannelDto } from './dtos/update-channel.dto';
import { UpdateDateColumn } from 'typeorm';
import { IDiscussion } from './interface/discussion.interface';

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
        console.log('connect', socket.id, user.username);
        return this.server.to(socket.id).emit('channels', channels);
      }
    } catch (e) {
      return this.disconnect(socket);
    }
  }

  async handleDisconnect(socket: Socket) {
    console.log('disconnect', socket.id);
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
    const channel = await this.channelService.getChannelByName(
      discussion.channel.name,
    );
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
    const updateChannel = await this.channelService.updateChannel(
      createdChannel,
      { users: [channelUser, channelUserInvite] },
    );
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
    await this.sendChannelToEveryone(socket.data.user.id);
    await this.switchToChannel(socket, updateChannel);
  }

  @SubscribeMessage('createChannel')
  async onCreateChannel(socket: Socket, channel: IChannel) {
    const channelExist = await this.channelService.getChannelByName(
      channel.name,
    );
    if (channelExist) {
      this.handleError(socket, 'channel already exist');
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
    const updatedChannel = await this.channelService.updateChannel(
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
        if (this.countdownIsDown(user.unban_at)) {
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
    const channels = await this.channelService.getChannels(
      socket?.data?.user?.id,
    );
    return this.server.to(socket.id).emit('channels', channels);
  }

  @SubscribeMessage('getChannels')
  async getChannels(socket: Socket) {
    const channels = await this.channelService.getChannelsForUser(
      socket.data?.user?.id,
    );
    return this.server.to(socket.id).emit('channels', channels);
  }

  @SubscribeMessage('changeChannelState')
  async onChangeChannelState(socket: Socket, updateChannel: UpdateChannelDto) {
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
    if (user.administrator === false) {
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
    await this.channelService.updateChannel(channel, updateChannel);
    await this.sendChannelToEveryone(socket.data.user.id);
    await this.updateCurrentChannel(channel.id);
  }

  /** ---------------------------  MESSAGE  -------------------------------- */

  @SubscribeMessage('addMessage')
  async onAddMessage(socket: Socket, message: IMessage) {
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

  // private async checkRightsAndFindUser(
  //   user: IUser,
  //   channel: IChannel,
  //   target: IUser,
  // ): Promise<IChannelUser> {
  //   const [channelDB, userDB] = await this.getChannelAndUser(channel, user);
  //   if (!userDB) {
  //     throw new WsException('user not found');
  //   }
  //   if (userDB.administrator === false) {
  //     throw new WsException('user does not have the rights');
  //   }
  //   // Get target
  //   const newAdminUser = await this.channelUserService.findUserInChannel(
  //     channelDB,
  //     target,
  //   );
  //   if (!newAdminUser) {
  //     throw new WsException('user target not found');
  //   }
  //   return newAdminUser;
  // }

  // @SubscribeMessage('addAdministrator')
  // async addingUserToAdministrator(socket: Socket, newAdmin: IUpdateAdmin) {
  //   const target = await this.checkRightsAndFindUser(
  //     socket.data.user,
  //     newAdmin.channel,
  //     newAdmin.user.user,
  //   );
  //   await this.channelUserService.updateUser(target, {
  //     administrator: true,
  //   });
  // }

  // @SubscribeMessage('removeAdministrator')
  // async removeUserToAdministrator(socket: Socket, removeAdmin: IUpdateAdmin) {
  //   const target = await this.checkRightsAndFindUser(
  //     socket.data.user,
  //     removeAdmin.channel,
  //     removeAdmin.user.user,
  //   );
  //   await this.channelUserService.updateUser(target, { administrator: false });
  // }

  //   /** ---------------------------  BAN / MUTE  -------------------------------- */

  private countdownIsDown(countdown: Date): boolean {
    const now = new Date();
    return now >= countdown;
  }

  //   private async getTargetAndSecureRights(
  //     channel: IChannel,
  //     target: IUser,
  //     user: IUser,
  //   ) {
  //     const [channelDB, userDB] = await this.getChannelAndUser(channel, user);
  //     if (!userDB) {
  //       throw new WsException('user not found');
  //     }
  //     if (userDB.administrator === false) {
  //       throw new WsException('user does not have the rights');
  //     }
  //     const targetDB = await this.channelUserService.findUserInChannel(
  //       channel,
  //       target,
  //     );
  //     if (!targetDB) {
  //       throw new WsException('user target not found');
  //     }
  //     return targetDB;
  //   }

  //   @SubscribeMessage('banUser')
  //   async onBanUser(socket: Socket, banUser: IUpdateUser) {
  //     console.log('banUser', banUser);
  //     if (socket.data.user.id === banUser.user.id) {
  //       throw new BadRequestException('impossible to ban yourself');
  //     }
  //     const target = await this.getTargetAndSecureRights(
  //       banUser.channel,
  //       banUser.user,
  //       socket.data.user,
  //     );
  //     const now = new Date();
  //     await this.channelUserService.updateUser(target, {
  //       ban: true,
  //       unban_at: new Date(now.getTime() + banUser.milliseconds),
  //     });

  //     // kick user of channel if user is connected to the channel
  //     const bannedUser = await this.connectedUserService.findByUserAndMode(
  //       target.user,
  //       Mode.chat,
  //     );
  //     // Tell frontend that the user is not anymore in the channel
  //     if (bannedUser) {
  //       this.server.to(bannedUser.socketId).emit('currentChannel', null);
  //     }
  //     const joinedChannel = await this.joinedChannelService.findByUserAndChannel(
  //       banUser.channel,
  //       target.user,
  //     );
  //     // kick user of the channel
  //     if (joinedChannel) {
  //       await this.joinedChannelService.delete(joinedChannel);
  //     }
  //   }

  //   @SubscribeMessage('unbanUser')
  //   async onUnbanUser(socket: Socket, unbanUser: IUpdateUser) {
  //     if (socket.data.user.id === unbanUser.user.id) {
  //       throw new BadRequestException('impossible to unban yourself');
  //     }
  //     const target = await this.getTargetAndSecureRights(
  //       unbanUser.channel,
  //       unbanUser.user,
  //       socket.data.user,
  //     );
  //     await this.channelUserService.updateUser(target, {
  //       ban: false,
  //       unban_at: null,
  //     });
  //   }

  //   @SubscribeMessage('muteUser')
  //   async onMuteUser(socket: Socket, muteUser: IUpdateUser) {
  //     if (socket.data.user.id === muteUser.user.id) {
  //       throw new BadRequestException('impossible to mute yourself');
  //     }
  //     const target = await this.getTargetAndSecureRights(
  //       muteUser.channel,
  //       muteUser.user,
  //       socket.data.user,
  //     );
  //     const now = new Date();
  //     await this.channelUserService.updateUser(target, {
  //       mute: true,
  //       unmute_at: new Date(now.getTime() + muteUser.milliseconds),
  //     });
  //   }

  //   @SubscribeMessage('unmuteUser')
  //   async onUnmuteUser(socket: Socket, unmuteUser: IUpdateUser) {
  //     if (socket.data.user.id === unmuteUser.user.id) {
  //       throw new BadRequestException('impossible to unmute yourself');
  //     }
  //     const target = await this.getTargetAndSecureRights(
  //       unmuteUser.channel,
  //       unmuteUser.user,
  //       socket.data.user,
  //     );
  //     await this.channelUserService.updateUser(target, {
  //       mute: false,
  //       unmute_at: null,
  //     });
  //   }
  // }
}
