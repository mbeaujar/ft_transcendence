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
import { IChannel } from '../interface/channel.interface';
import { ConnectedUserService } from '../services/connected-user/connected-user.service';
import { ChannelService } from '../services/channel/channel.service';
import { JoinedChannelService } from '../services/joined-channel/joined-channel.service';
import { MessageService } from '../services/message/message.service';
import { IMessage } from '../interface/message.interface';
import { Message } from '../entities/message.entity';
import { JoinedChannel } from '../entities/joined-channel.entity';
import { IUser } from 'src/users/interface/user.interface';
import { ChannelUserService } from '../services/channel-user/channel-user.service';

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
        const channels = await this.channelService.getChannelForUser(user.id);
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
    socket.disconnect();
  }

  private disconnect(socket: Socket) {
    socket.emit('Error', new UnauthorizedException());
    socket.disconnect();
  }

  /** ---------------------------  CHANNEL -------------------------------- */

  @SubscribeMessage('createChannel')
  async onCreateChannel(socket: Socket, channel: IChannel) {
    const channelUser = await this.channelUserService.create({
      administrator: true,
      creator: true,
      channelId: 0,
      user: socket.data.user,
    });
    const createdChannel: IChannel = await this.channelService.createChannel(
      channel,
      channelUser,
    );
    channelUser.channelId = createdChannel.id;
    await this.channelUserService.save(channelUser);

    const channels = await this.channelService.getAllChannels();
    const connectedUsers = await this.connectedUserService.getAll();
    for (const user of connectedUsers) {
      this.server.to(user.socketId).emit('channels', channels);
    }
  }

  @SubscribeMessage('joinChannel')
  async onJoinChannel(socket: Socket, channel: IChannel) {
    const channelDB = await this.channelService.getChannel(channel.id);
    if (!channelDB) {
      throw new WsException('channel not found');
    }
    // if user is not already in the channel
    const user = await this.channelUserService.findByUser(socket.data.user);
    if (!user) {
      if (channel.state === 1) {
        throw new WsException('private channel');
      }
      if (channel.state === 2) {
        await this.channelService.verifyPassword(channelDB, channel.password);
      }
      const newUser = await this.channelUserService.create({
        administrator: false,
        creator: false,
        channelId: channelDB.id,
        user: socket.data.user,
      });
      await this.channelService.addUser(channel, newUser);
    }
    // Leave channel before join another (make nothing if the user is not already in a channel)
    await this.joinedChannelService.deleteBySocketId(socket.id);

    const messages = await this.messageService.findMessageByChannel(channel);
    await this.joinedChannelService.create({
      socketId: socket.id,
      user: socket.data.user,
      channelId: channelDB.id,
    });
    this.server.to(socket.id).emit('messages', messages);
  }

  @SubscribeMessage('leaveChannel')
  async onLeaveChannel(socket: Socket, channel: IChannel) {
    await this.channelUserService.deleteByChannelAndUser(
      channel.id,
      socket.data.user,
    );
    // await this.joinedChannelService.deleteBySocketId(socket.id);
  }

  @SubscribeMessage('getAllChannels')
  async getAllChannels(socket: Socket) {
    const channels = await this.channelService.getAllChannels();
    return this.server.to(socket.id).emit('channels', channels);
  }

  @SubscribeMessage('getChannels')
  async getChannels(socket: Socket) {
    const channels = await this.channelService.getChannelForUser(
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
}
