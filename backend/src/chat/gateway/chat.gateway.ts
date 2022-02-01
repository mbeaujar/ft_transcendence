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

  // @Auth()
  @SubscribeMessage('message')
  async sendMessages(@MessageBody() message: string) {
    this.server.emit('message', message);
  }

  @SubscribeMessage('createChannel')
  async onCreateChannel(socket: Socket, channel: IChannel): Promise<IChannel> {
    return this.chatService.createChannel(channel, socket.data.user);
  }

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
}
