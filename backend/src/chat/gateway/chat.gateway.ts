import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { AuthService } from '../../auth/services/auth.service';
import { UsersService } from '../../users/services/users.service';
import { User } from '../../users/entities/user.entity';
import { OnModuleInit, UnauthorizedException } from '@nestjs/common';
import { IChannel } from '../model/channel/channel.interface';
import { ConnectedUserService } from '../services/connected-user/connected-user.service';
import { ChannelService } from '../services/channel/channel.service';
import { JoinedChannelService } from '../services/joined-channel/joined-channel.service';
import { MessageService } from '../services/message/message.service';
import { IMessage } from '../model/message/message.interface';
import { Message } from '../model/message/message.entity';
import { JoinedChannel } from '../model/joined-channel/joined-channel.entity';
import { ChannelUserService } from '../services/channel-user/channel-user.service';
import { Channel } from '../model/channel/channel.entity';
import { IJoinChannel } from '../interface/join-channel.interface';
import { State } from '../interface/state.enum';
import { IUpdateAdmin } from '../interface/update-admin.interface';
import { IUser } from 'src/users/interface/user.interface';
import { IChannelUser } from '../model/channel-user/channel-user.interface';

// Server emit:
// channels 					-> list of channels
// messages 					-> history of message
// messagesAdded 			-> new message
// currentChannel 		-> current channel of the user

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:8080'],
    credentials: true,
  },
})
export class ChatGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnModuleInit
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
        const channels = await this.channelService.getChannels();
        await this.connectedUserService.create({ socketId: socket.id, user });
        console.log('connect', socket.id, user.username);
        return this.server.to(socket.id).emit('channels', channels);
      }
    } catch (e) {
      console.log(e);
      return this.disconnect(socket);
    }
  }

  async handleDisconnect(socket: Socket) {
    console.log('disconnect', socket.id);
    await this.connectedUserService.deleteBySocketId(socket.id);
    await this.joinedChannelService.deleteBySocketId(socket.id);
    socket.disconnect();
  }

  private disconnect(socket: Socket) {
    socket.emit('Error', new UnauthorizedException());
    socket.disconnect();
  }

  /** ---------------------------  CHANNEL -------------------------------- */

  private async sendChannelToEveryone() {
    const channels = await this.channelService.getChannels();
    const connectedUsers = await this.connectedUserService.getAll();
    for (const user of connectedUsers) {
      this.server.to(user.socketId).emit('channels', channels);
    }
  }

  private async switchToChannel(socket: Socket, channel: IChannel) {
    // Quit channel if the user is already in a channel
    await this.joinedChannelService.deleteBySocketId(socket.id);

    // Join the channel
    await this.joinedChannelService.create({
      socketId: socket.id,
      user: socket.data.user,
      channelId: channel.id,
    });

    // Get the message history
    const messages = await this.messageService.findMessageByChannel(channel);
    this.server.to(socket.id).emit('messages', messages);

    // Send the current channel of the user
    const currentChannel: IChannel = {
      id: channel.id,
      name: channel.name,
      users: channel.users,
    };
    this.server.to(socket.id).emit('currentChannel', currentChannel);
  }

  @SubscribeMessage('createChannel')
  async onCreateChannel(socket: Socket, channel: IChannel) {
    // Create channel
    const createdChannel: Channel = await this.channelService.createChannel(
      channel,
    );
    // Create user owner
    const channelUser = await this.channelUserService.createUser({
      administrator: true,
      creator: true,
      user: socket.data.user,
      channelId: createdChannel.id,
      channel: createdChannel,
    });
    const updatedChannel = await this.channelService.updateChannel(
      createdChannel,
      {
        users: [channelUser],
      },
    );
    // Prevent everyone that a new channel is created
    this.sendChannelToEveryone();
    // Switch to the channel created
    this.switchToChannel(socket, updatedChannel);
  }

  @SubscribeMessage('removeChannel')
  async onRemoveChannel(socket: Socket, channel: IChannel) {
    const channelDB = await this.channelService.getChannel(channel.id);
    if (!channelDB) {
      throw new WsException('channel not found');
    }
    // Delete all users
    await this.channelUserService.deleteAllUsersInChannel(channelDB);
    // Delete users who are connected in the channel
    await this.joinedChannelService.deleteByChannel(channelDB);
    // Delete channel
    await this.channelService.deleteChannel(channelDB);
    // Prevent everyone that a channel as been deleted
    this.sendChannelToEveryone();
  }

  @SubscribeMessage('joinChannel')
  async onJoinChannel(socket: Socket, joinChannel: IJoinChannel) {
    const channelDB = await this.channelService.getChannel(
      joinChannel.channel.id,
    );
    if (!channelDB) {
      throw new WsException('channel not found');
    }
    const user = await this.channelUserService.findUserInChannel(
      channelDB,
      socket.data.user,
    );
    // Check if user is already in the channel
    if (!user) {
      if (channelDB.state === State.private) {
        throw new WsException('private channel');
      }
      if (channelDB.state === State.protected) {
        // throw if invalid password
        await this.channelService.verifyPassword(
          channelDB,
          joinChannel.password,
        );
      }
      const newUser = await this.channelUserService.createUser({
        administrator: false,
        creator: false,
        user: socket.data.user,
        channelId: channelDB.id,
        channel: channelDB,
      });
      await this.channelService.addUser(channelDB, newUser);
    }
    await this.switchToChannel(socket, channelDB);
  }

  @SubscribeMessage('leaveChannel')
  async onLeaveChannel(socket: Socket, channel: IChannel) {
    const channelDB = await this.channelService.getChannel(channel.id);
    if (!channelDB) {
      throw new WsException('channel not found');
    }
    // Quit channel
    await this.joinedChannelService.deleteBySocketId(socket.id);

    const channelUser = await this.channelUserService.findUserInChannel(
      channelDB,
      socket.data.user,
    );

    // Delete user in the channel
    await this.channelUserService.deleteUser(channelUser);
    // if there is no more user anymore in the channel we delete it
    if (channelDB.users.length === 1) {
      await this.channelService.deleteChannel(channelDB);
    } else if (channelUser.creator === true) {
      // if the deleted user was the owner we make a new user the owner of the channel
      const admins: IChannelUser[] =
        await this.channelUserService.getAdminsInChannel(channelDB);
      // give it to a random admin user
      if (admins.length > 0) {
        await this.channelUserService.updateUser(admins[0], { creator: true });
      } else {
        // give it to a random user
        const users: IChannelUser[] =
          await this.channelUserService.getUsersInChannel(channelDB);
        await this.channelUserService.updateUser(users[0], {
          creator: true,
          administrator: true,
        });
      }
      console.log('admins', admins);
    }
    // Prevent everyone that a channel as been deleted
    this.sendChannelToEveryone();
  }

  @SubscribeMessage('getAllChannels')
  async getAllChannels(socket: Socket) {
    const channels = await this.channelService.getChannels();
    return this.server.to(socket.id).emit('channels', channels);
  }

  @SubscribeMessage('getChannels')
  async getChannels(socket: Socket) {
    const channels = await this.channelService.getChannelsForUser(
      socket.data?.user?.id,
    );
    return this.server.to(socket.id).emit('channels', channels);
  }

  /** ---------------------------  MESSAGE  -------------------------------- */

  @SubscribeMessage('addMessage')
  async onAddMessage(socket: Socket, message: IMessage) {
    const createdMessage: Message = await this.messageService.create({
      ...message,
      user: socket.data.user,
    });
    const channel = await this.channelService.getChannel(
      createdMessage.channel.id,
    );
    const joinedUsers: JoinedChannel[] =
      await this.joinedChannelService.findByChannel(channel);
    /** Send to all users (maybe check if there are users who are muted by the chat or by the users) */
    for (const user of joinedUsers) {
      this.server.to(user.socketId).emit('messageAdded', createdMessage);
    }
  }

  /** ---------------------------  ADMINISTRATOR  -------------------------------- */

  private async checkRightsAndFindUser(
    user: IUser,
    channelId: number,
    target: IUser,
  ): Promise<IChannelUser> {
    // Get channel
    const channel: IChannel = await this.channelService.getChannel(channelId);
    if (!channel) {
      throw new WsException('channel not found');
    }
    // Get user
    const userDB: IChannelUser =
      await this.channelUserService.findUserInChannel(channel, user);
    if (!userDB) {
      throw new WsException('user not found');
    }
    if (userDB.creator === false) {
      throw new WsException('user does not have the rights');
    }
    // Get target
    const newAdminUser = await this.channelUserService.findUserInChannel(
      channel,
      target,
    );
    if (!newAdminUser) {
      throw new WsException('user target not found');
    }
    return newAdminUser;
  }

  @SubscribeMessage('addAdministrator')
  async addingUserToAdministrator(socket: Socket, newAdmin: IUpdateAdmin) {
    const target = await this.checkRightsAndFindUser(
      socket.data.user,
      newAdmin.channel.id,
      newAdmin.user.user,
    );
    await this.channelUserService.updateUser(target, {
      administrator: true,
    });
  }

  @SubscribeMessage('removeAdministrator')
  async removeUserToAdministrator(socket: Socket, removeAdmin: IUpdateAdmin) {
    const target = await this.checkRightsAndFindUser(
      socket.data.user,
      removeAdmin.channel.id,
      removeAdmin.user.user,
    );
    await this.channelUserService.updateUser(target, { administrator: false });
  }
}
