import { OnModuleDestroy, UnauthorizedException } from '@nestjs/common';
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
import { GameService } from '../services/game.service';
import { ConnectedUserService } from 'src/chat/services/connected-user.service';
import { IQueue } from '../model/queue/queue.interface';
import { Queue } from '../model/queue/queue.entity';

@WebSocketGateway({
  namespace: '/game',
  cors: {
    origin: ['http://localhost:8080'],
    credentials: true,
  },
})
export class GameGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnModuleDestroy
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
        // await this.connectedUserService.deleteByUser(user);
        await this.connectedUserService.create({ socketId: client.id, user });
      }
    } catch (e) {
      return this.disconnect(client);
    }
  }

  async handleDisconnect(client: Socket) {
    console.log('disconnect', client.id, client.data.user?.username);
    if (client.data.user) {
      // await this.connectedUserService.deleteByUser(client.data.user);
      await this.connectedUserService.deleteBySocketId(client.id);
      await this.queueService.delete(client.data.user?.id);
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
      await this.gameService.joinGame(match.id, client.data.user);
    }
  }

  /** --------------------------- QUEUE -------------------------------------- */

  private async startGame(queue1: IQueue, user2: IUser, mode: number) {
    await this.gameService.startGame(queue1.user, user2, mode, this.server);
  }

  @SubscribeMessage('joinQueue')
  async onJoinQueue(client: Socket, game: IGame) {
    const queueExist = await this.queueService.find(client.data.user.id);
    // Todo(maybe): check if the user is already in game
    if (queueExist) return;

    await this.queueService.create({
      elo: client?.data?.user?.elo,
      user: client?.data?.user,
      invite: game.invite ? game.invite : 0,
      target: game.target,
      mode: game.mode,
    });
    // Search other user in the queue
    const interval = setInterval(async () => {
      // check if the user is in the queue (stop if not)
      const queue = await this.queueService.find(client.data.user.id);
      if (!queue) {
        clearInterval(interval);
        return;
      }
      let player: Queue;
      if (queue.invite === 1) {
        player = await this.queueService.findQueue(queue.target);
      } else {
        player = await this.queueService.findOpponents(
          client.data.user.id,
          client.data.user.elo,
          game.mode,
        );
      }
      // Start game if we found an opponent
      if (player) {
        if (queue.user && player.user) {
          clearInterval(interval);
          const user = player.user;
          await this.queueService.delete(player.user.id);
          await this.startGame(queue, user, game.mode);
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
      if (match.live === 1) {
        if (
          match.players[0].user.id === client.data.user.id ||
          match.players[1].user.id === client.data.user.id
        ) {
          this.gameService.moveTop(match.id, client.data.user);
          // this.game[match.id].moveTop(client.data.user);
        }
      }
    }
  }

  @SubscribeMessage('moveBotPaddle')
  async moveBotPaddle(client: Socket, game: IGame) {
    const match = await this.matchService.find(game.id);
    if (match) {
      if (match.live === 1) {
        if (
          match.players[0].user.id === client.data.user.id ||
          match.players[1].user.id === client.data.user.id
        ) {
          this.gameService.moveBot(match.id, client.data.user);
          // this.game[match.id].moveBot(client.data.user);
        }
      }
    }
  }

  @SubscribeMessage('deleteConnected')
  async on(socket: Socket) {
    await this.connectedUserService.deleteByUser(socket.data.user);
  }
}