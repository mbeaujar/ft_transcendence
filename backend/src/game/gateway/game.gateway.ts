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
import { Queue } from '../model/queue/queue.entity';
import { Mode } from 'src/chat/model/connected-user/mode.enum';
import * as cookieParser from 'cookie-parser';
import { IMatch } from '../model/match/match.interface';

@WebSocketGateway({
  namespace: '/game',
  cors: {
    origin: ['http://localhost:8080', 'http://localhost:8081'],
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
        cookieParser.signedCookie(
          client.handshake.headers.authorization,
          process.env.COOKIE_SECRET,
        ),
      );
      if (!decodedToken) {
        return this.disconnect(client);
      }
      const user: IUser = await this.usersService.findUser(decodedToken.sub);
      if (!user) {
        return this.disconnect(client);
      } else {
        client.data.user = user;
        await this.connectedUserService.create({
          socketId: client.id,
          user,
          mode: Mode.game,
        });
      }
    } catch (e) {
      return this.disconnect(client);
    }
  }

  async handleDisconnect(client: Socket) {
    if (client.data.user) {
      await this.connectedUserService.deleteByUser(client.data.user);
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
  async spectatorJoinGame(client: Socket, id: number) {
    const match = await this.matchService.find(id);
    if (match) {
      await this.gameService.joinGame(match.id, client.data.user);
    }
  }

  /** --------------------------- QUEUE -------------------------------------- */

  private async startGame(
    user1: IUser,
    user2: IUser,
    mode: number,
  ): Promise<IMatch> {
    return this.gameService.startGame(user1, user2, mode, this.server);
  }

  @SubscribeMessage('joinQueue')
  async onJoinQueue(client: Socket, game: IGame) {
    const queueExist = await this.queueService.find(client.data.user.id);
    const match = await this.matchService.userIsPlaying(client.data.user.id);
    if (queueExist || match) return;

    let player: Queue;
    if (game.invite === 1) {
      player = await this.queueService.findQueue(
        client.data.user.id,
        game.target,
        game.mode,
      );
    } else {
      player = await this.queueService.findOpponents(
        client.data.user.id,
        client.data.user.elo,
        game.mode,
      );
    }
    // Start game if we found an opponent
    if (player) {
      if (client.data.user && player.user) {
        const user = player.user;
        // Delete opponent queue
        await this.queueService.delete(player.user.id);
        const me = await this.usersService.findUser(client.data.user.id);
        const match = await this.startGame(me, user, game.mode);
        // prevent every spectator that a new game has been created
        const connectedSpectators = await this.connectedUserService.getAll(
          Mode.game,
        );
        for (const connectedSpectator of connectedSpectators) {
          this.server.to(connectedSpectator.socketId).emit('newGame', match);
        }
        return;
      }
    } else {
      // Create a queue for somebody to find me
      await this.queueService.create({
        elo: client?.data?.user?.elo,
        user: client?.data?.user,
        invite: game.invite ? game.invite : 0,
        target: game.target,
        mode: game.mode,
      });
    }
  }

  @SubscribeMessage('gameIsOver')
  async gameEnded(client: Socket, gameId: number) {
    console.log('imagine');
    const match = await this.matchService.find(gameId);
    
    // this.server.to(client.id).emit('removeGame', { match });
    // return await this.matchService.delete(gameId);
  }

  @SubscribeMessage('leaveQueue')
  async onLeaveQueue(client: Socket) {
    await this.queueService.delete(client.data.user.id);
  }

  @SubscribeMessage('leaveGame')
  async onLeaveGame(client: Socket, game: IGame) {
    const match = await this.matchService.find(game.id);
    if (match && match.live === 1) {
      if (
        match.players[0].user.id === client.data.user.id ||
        match.players[1].user.id === client.data.user.id
      ) {
        this.gameService.leaveGame(match.id, client.data.user);
      }
    }
  }

  /** --------------------------- MOVEMENT -------------------------------------- */

  @SubscribeMessage('moveTopPaddle')
  async moveTopPaddle(client: Socket, game: IGame) {
    const match = await this.matchService.find(game.id);
    console.log("match===",match," matchlive==",match.live);
    if (match && match.live === 1  ) {
      if (
        match.players[0].user.id === client.data.user.id ||
        match.players[1].user.id === client.data.user.id
        ) {
        this.gameService.moveTop(match.id, client.data.user);
      }
    } else {
      const matchExist = await this.matchService.userIsPlaying(
        client.data.user.id,
      );
      if (matchExist) {
        this.server.to(client.id).emit('startGame', { match: matchExist });
      }
    }
  }

  @SubscribeMessage('moveBotPaddle')
  async moveBotPaddle(client: Socket, game: IGame) {
    const match = await this.matchService.find(game.id);
    // console.log("match===",match," matchlive==",match.live);
    if (match && match.live === 1) {
      // console.log("backbot")  
      if (
        match.players[0].user.id === client.data.user.id ||
        match.players[1].user.id === client.data.user.id
        ) {
        this.gameService.moveBot(match.id, client.data.user);
      }
    } else {
      const matchExist = await this.matchService.userIsPlaying(
        client.data.user.id,
      );
      if (matchExist) {
        this.server.to(client.id).emit('startGame', { match: matchExist });
      }
    }
  }

  @SubscribeMessage('deleteConnected')
  async on(socket: Socket) {
    await this.connectedUserService.deleteByUser(socket.data.user);
  }

  @SubscribeMessage('getGame')
  async getGame(socket: Socket, id: number) {
    //console.log("idback=",id);
    if (id){
      const match = await this.gameService.getGame(id);
      this.server.to(socket.id).emit('startGame', { match });
      // console.log('match=', match);
    }
  }
}
