import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
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
import { Channel } from '../entities/channel.entity';
import { JoinedChannel } from '../entities/joined-channel.entity';

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
    const createdChannel: IChannel = await this.channelService.createChannel(
      channel,
      socket.data.user,
    );
    const channels = await this.channelService.getAllChannels();
    this.server.to(socket.id).emit('channels', channels);
  }

  @SubscribeMessage('joinChannel')
  async onJoinChannel(socket: Socket, channel: IChannel) {
    console.log('channel', channel);

    if (channel.state === 2) {
      await this.channelService.verifyPassword(channel.id, channel.password);
    }

    const messages = await this.messageService.findMessageByChannel(channel);

    // console.log('channel', channel);
    await this.joinedChannelService.create({
      socketId: socket.id,
      user: socket.data.user,
      channel,
    });

    await this.channelService.addUser(channel, socket.data.user);

    this.server.to(socket.id).emit('messages', messages);
  }

  @SubscribeMessage('leaveChannel')
  async onLeaveChannel(socket: Socket) {
    await this.joinedChannelService.deleteBySocketId(socket.id);
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
    const channel: Channel = await this.channelService.getChannel(
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
