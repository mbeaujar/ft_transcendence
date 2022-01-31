import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';
import { UnauthorizedException } from '@nestjs/common';

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
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  // @Auth()
  @SubscribeMessage('message')
  async sendMessages(@MessageBody() message: string) {
    this.server.emit('message', message);
  }

  async handleConnection(socket: Socket) {
    try {
      const decodedToken = await this.authService.verifyJwt(
        socket.handshake.headers.authorization,
      );
      console.log('decodedToken', decodedToken);
      const user: User = await this.usersService.findUser(decodedToken.sub);
      console.log('user', user);
      if (!user) {
        // disconnect
        return this.disconnect(socket);
      }
      // connect
      console.log('On Connect');
    } catch {
      // disconnect
      return this.disconnect(socket);
    }
  }

  handleDisconnect() {
    console.log('On Disconnect');
  }

  private disconnect(socket: Socket) {
    socket.emit('Error', new UnauthorizedException());
    socket.disconnect();
  }
}
