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
import { ConnectedUserService } from 'src/chat/services/connected-user/connected-user.service';
import { IUser } from 'src/users/interface/user.interface';
import { UsersService } from 'src/users/services/user/users.service';
import { IMatch } from '../entities/match.interface';
import { IPlayer } from '../entities/player.interface';
import { IQueue } from '../entities/queue.interface';
import { Game } from '../model/game';
import { GameService } from '../services/game/game.service';
import { MatchService } from '../services/match/match.service';
import { QueueService } from '../services/queue/queue.service';

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
    private readonly queueService: QueueService,
    private readonly gameService: GameService,
    private readonly matchService: MatchService,
    private readonly connectedUserService: ConnectedUserService,
  ) {}

  @WebSocketServer()
  server: Server;

  game: any;

  async onModuleInit() {
    this.game = {};
  }

  /** --------------------------- CONNECTION --------------------------------#DirtyDrivers #F1 #F12017------ */

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
        await this.connectedUserService.create({ socketId: client.id, user });
      }
    } catch (e) {
      console.log(e);
      return this.disconnect(client);
    }
  }

  async handleDisconnect(client: Socket) {
    console.log('disconnect', client.id, client.data.user?.username);
    if (client.data.user) {
      await this.connectedUserService.deleteBySocketId(client.id);
      await this.queueService.delete(client.data.user?.id); // ??
    }
    client.disconnect();
  }

  private disconnect(client: Socket) {
    client.emit('Error', new UnauthorizedException());
    client.disconnect();
  }

  /** --------------------------- SAMPLE -------------------------------------- */

  @SubscribeMessage('ping')
  async ping(client: Socket, args: any) {
    // console.log('client user', client.data.user);
    // console.log('args', args);
    console.log('ping', client.data.user.username, client.id);
    this.server.to(client.id).emit('pong', 'pong');
  }

  /** --------------------------- QUEUE -------------------------------------- */

  private async sendGameStarted(player: IPlayer, match: IMatch) {
    const connectedPlayer = await this.connectedUserService.findByUser(
      player.user,
    );
    if (connectedPlayer) {
      this.server.to(connectedPlayer.socketId).emit('startGame', { match });
    }
  }

  private async startGame(queue1: IQueue, queue2: IQueue) {
    const match = await this.gameService.create(queue1.user, queue2.user);
    this.game[match.id] = new Game(
      match,
      this.matchService,
      this.usersService,
      this.connectedUserService,
      this.server,
    );

    this.sendGameStarted(match.players[0], match);
    this.sendGameStarted(match.players[1], match);
  }

  @SubscribeMessage('joinQueue')
  async onJoinQueue(client: Socket) {
    const queueExist = await this.queueService.find(client.data.user.id);
    if (queueExist) return;

    await this.queueService.create({
      elo: client?.data?.user?.elo,
      user: client?.data?.user,
    });
    const interval = setInterval(async () => {
      const queue = await this.queueService.find(client.data.user.id);
      if (!queue) {
        clearInterval(interval);
      }
      const players = await this.queueService.findOpponents(
        client.data.user.id,
        client.data.user.elo,
      );
      // console.log('liste', players);
      if (players.length > 0) {
        await this.startGame(queue, players[0]);
        await this.queueService.delete(client.data.user.id);
        clearInterval(interval);
      }
    }, 100);
  }

  @SubscribeMessage('leaveQueue')
  async onLeaveQueue(client: Socket) {
    await this.queueService.delete(client.data.user.id);
  }

  /** --------------------------- MOVEMENT -------------------------------------- */

  @SubscribeMessage('moveTopPaddle')
  async moveTopPaddle(client: Socket) {
    const match = await this.matchService.findByUser(client.data.user.id);
    if (match) {
      this.game[match.id].moveTop(client.data.user);
    }
  }

  @SubscribeMessage('moveBotPaddle')
  async moveBotPaddle(client: Socket) {
    const match = await this.matchService.findByUser(client.data.user.id);
    if (match) {
      this.game[match.id].moveBot(client.data.user);
    }
  }

  @SubscribeMessage('lala')
  async onadd(client: Socket) {
    this.server
      .to(client.id)
      .emit('infoGame', { ballx: 400, bally: 200, player1: 10, player2: 20 });
  }

  @SubscribeMessage('deleteQueue')
  async ondeleteMass(client: Socket) {
    await this.queueService.delete(client.data.user.id);
  }
}
