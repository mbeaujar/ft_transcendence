import { OnModuleInit, UnauthorizedException } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { AuthService } from 'src/auth/services/auth.service';
import { IUser } from 'src/users/interface/user.interface';
import { UsersService } from 'src/users/services/user/users.service';
import { Game } from '../model/Game';
import { GameService } from '../services/game.service';

@WebSocketGateway({
  namespace: '/game',
  cors: {
    origin: ['http://localhost:8080'],
    credentials: true,
  },
})
export class GameGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnModuleInit
{
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
    private readonly gameService: GameService,
  ) {}

  @WebSocketServer()
  server: Server;

  game: any;

  async onModuleInit() {
    this.game = {};
  }

  /** --------------------------- CONNECTION -------------------------------------- */

  async handleConnection(client: Socket) {
    try {
      const decodedToken = await this.authService.verifyJwt(
        client.handshake.headers.authorization,
      );
      const user: IUser = await this.usersService.findUser(decodedToken.sub);
      if (!user) {
        return this.disconnect(client);
      } else {
        client.data.user = user;
        console.log('connect', client.id, user.username);
      }
    } catch (e) {
      console.log(e);
      return this.disconnect(client);
    }
  }

  async handleDisconnect(client: Socket) {
    console.log('disconnect', client.id, client.data.user?.username);
    client.disconnect();
  }

  private disconnect(client: Socket) {
    client.emit('Error', new UnauthorizedException());
    client.disconnect();
  }

  /** --------------------------- SAMPLE -------------------------------------- */

  @SubscribeMessage('ping')
  async ping(client: Socket, args: any) {
    console.log('client id', client.id);
    console.log('client user', client.data.user);
    console.log('args', args);
    this.server.to(client.id).emit('pong', 'pong');
  }

  /** --------------------------- GAME -------------------------------------- */

  @SubscribeMessage('createGame')
  async onCreateGame(client: Socket) {
    // create Match entity
    const match = this.gameService.createMatch();
    this.game = new Game();

    // send createdGame
  }

  @SubscribeMessage('resetPoint')
  async resetPlayerPoint(client: Socket) {
    this.game.resetPoint();
  }
}
