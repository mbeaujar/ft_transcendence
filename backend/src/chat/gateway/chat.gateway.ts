import {
  MessageBody,
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
import { UnauthorizedException } from '@nestjs/common';
import { ChatService } from '../services/chat.service';
import { IChannel } from '../interface/channel.interface';
import { Channel } from '../entities/channel.entity';
import { IPage } from '../interface/page.interface';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:8080', 'https://hoppscotch.io'],
    credentials: true,
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly chatService: ChatService,
  ) {}

  async handleConnection(socket: Socket) {
    try {
      const decodedToken = await this.authService.verifyJwt(
        socket.handshake.headers.authorization,
      );
      const user: User = await this.usersService.findUser(decodedToken.sub);
      if (!user) {
        return this.disconnect(socket);
      } else {
        // connect
        socket.data.user = user;
        const channels = await this.chatService.getChannelForUser(user.id, {
          page: 1,
          limit: 10,
        });
        // Only emit channels to specific connected client
        // console.log('socket id', socket.id);
        return this.server.to(socket.id).emit('channels', channels);
      }
    } catch {
      return this.disconnect(socket);
    }
  }

  handleDisconnect(socket: Socket) {
    socket.disconnect();
  }

  private disconnect(socket: Socket) {
    socket.emit('Error', new UnauthorizedException());
    socket.disconnect();
  }

  @SubscribeMessage('message')
  async sendMessages(@MessageBody() message: string) {
    this.server.emit('message', message);
  }

  @SubscribeMessage('createChannel')
  async onCreateChannel(socket: Socket, channel: IChannel): Promise<Channel> {
    // console.log('channel:', channel);
    return this.chatService.createChannel(channel, socket.data.user);
  }

  @SubscribeMessage('paginateChannels')
  async onPaginateChannel(socket: Socket, { data }: any) {
    // console.log('page', data);
    data.limit = data.limit > 100 ? 100 : data.limit;
    const channels = await this.chatService.getChannelForUser(
      socket.data.user.id,
      data,
    );
    // console.log('channels paginate', channels);
    return this.server.to(socket.id).emit('channels', channels);
  }
}
