import {
  OnModuleDestroy,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { IGame } from '../model/game.interface';
import { MatchService } from '../services/match.service';
import { QueueService } from '../services/queue.service';
import { IUser } from 'src/users/model/user/user.interface';
import { UsersService } from 'src/users/users.service';
import { AuthService } from 'src/auth/auth.service';
import { PlayerService } from '../services/player.service';
import { GameService } from '../services/game.service';
import { ConnectedUserService } from 'src/chat/services/connected-user.service';
import { IPlayer } from '../model/player/player.interface';
import { IMatch } from '../model/match/match.interface';
import { IQueue } from '../model/queue/queue.interface';
import { Game } from './game';

@WebSocketGateway({
  namespace: '/game',
  cors: {
    origin: ['http://localhost:8080'],
    credentials: true,
  },
})
export class GameGateway
  implements
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnModuleInit,
    OnModuleDestroy
{
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
    private readonly playerService: PlayerService,
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

  async onModuleDestroy() {
    await this.connectedUserService.deleteAll();
  }

  /** --------------------------- CONNECTION -------------------------------- */

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

  @SubscribeMessage('listGame')
  async getAllGame(client: Socket) {
    const matchs = await this.matchService.findAllMatch();
    if (matchs) this.server.to(client.id).emit('listAllGame', { matchs });
  }

  @SubscribeMessage('joinGame')
  async spectatorJoinGame(client: Socket, game: IGame) {
    const match = await this.matchService.find(game.id);
    if (match) {
      await this.game[match.id].addSpectatorToGame(client.data.user);
    }
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

  private async startGame(queue1: IQueue, user2: IUser) {
    // Create Game
    const match = await this.gameService.create(queue1.user, user2);

    this.game[match.id] = new Game(
      match,
      this.matchService,
      this.playerService,
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

    // Add user in the queue
    await this.queueService.create({
      elo: client?.data?.user?.elo,
      user: client?.data?.user,
    });

    // Search other user in the queue
    const interval = setInterval(async () => {
      // check if the user is in the queue (stop if not)
      const queue = await this.queueService.find(client.data.user.id);
      if (!queue) {
        clearInterval(interval);
        return;
      }
      // list of opponents found
      const player = await this.queueService.findOpponents(
        client.data.user.id,
        client.data.user.elo,
      );
      // Start game if we found an opponent
      if (player) {
        if (queue.user && player.user) {
          clearInterval(interval);
          const user = player.user;
          await this.queueService.delete(player.user.id);
          await this.startGame(queue, user);
          await this.queueService.delete(queue.user.id);
          return;
        }
      }
    }, 1000);
  }

  @SubscribeMessage('leaveQueue')
  async onLeaveQueue(client: Socket) {
    await this.queueService.delete(client.data.user.id);
  }

  /** --------------------------- MOVEMENT -------------------------------------- */

  @SubscribeMessage('moveTopPaddle')
  async moveTopPaddle(client: Socket, game: IGame) {
    const match = await this.matchService.find(game.id);
    if (match) {
      if (
        match.players[0].user.id === client.data.user.id ||
        match.players[1].user.id === client.data.user.id
      ) {
        this.game[match.id].moveTop(client.data.user);
      }
    }
  }

  @SubscribeMessage('moveBotPaddle')
  async moveBotPaddle(client: Socket, game: IGame) {
    const match = await this.matchService.find(game.id);
    if (match) {
      if (
        match.players[0].user.id === client.data.user.id ||
        match.players[1].user.id === client.data.user.id
      ) {
        this.game[match.id].moveBot(client.data.user);
      }
    }
  }

  @SubscribeMessage('info')
  async oninfo(client: Socket, game: IGame) {
    const match = await this.matchService.find(game.id);
    if (match) {
      if (
        match.players[0].user.id === client.data.user.id ||
        match.players[1].user.id === client.data.user.id
      ) {
        this.game[match.id].printInfoGame();
      }
    }
  }

  @SubscribeMessage('deleteQueue')
  async ondeleteMass(client: Socket) {
    await this.queueService.delete(client.data.user.id);
  }
}
