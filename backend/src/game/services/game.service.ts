import { Injectable, OnModuleInit } from '@nestjs/common';
import { Server } from 'socket.io';
import { Mode } from 'src/chat/model/connected-user/mode.enum';
import { ConnectedUserService } from 'src/chat/services/connected-user.service';
import { State } from 'src/users/model/state.enum';
import { IUser } from 'src/users/model/user/user.interface';
import { UsersService } from 'src/users/users.service';
import { Game } from '../gateway/game';
import { Match } from '../model/match/match.entity';
import { IMatch } from '../model/match/match.interface';
import { IPlayer } from '../model/player/player.interface';
import { IQueue } from '../model/queue/queue.interface';
import { MatchService } from './match.service';
import { PlayerService } from './player.service';

@Injectable()
export class GameService implements OnModuleInit {
  constructor(
    private readonly matchService: MatchService,
    private readonly playerService: PlayerService,
    private readonly usersService: UsersService,
    private readonly connectedUserService: ConnectedUserService,
  ) {}

  game: any;

  onModuleInit() {
    this.game = {};
  }

  private async sendGameStarted(
    player: IPlayer,
    match: IMatch,
    server: Server,
  ) {
    const connectedPlayer = await this.connectedUserService.findByUserAndMode(
      player.user,
      Mode.game,
    );
    if (connectedPlayer) {
      server
        .to(connectedPlayer.socketId)
        .emit('startGame', { match, score: [0, 0] });
    }
  }

  async startGame(
    user1: IUser,
    user2: IUser,
    mode: number,
    server: Server,
  ): Promise<IMatch> {
    const match = await this.create(user1, user2, mode);

    this.game[match.id] = new Game(
      match,
      this.matchService,
      this.playerService,
      this.usersService,
      this.connectedUserService,
      server,
    );

    await this.usersService.updateUser(user1, { state: State.inGame });
    await this.usersService.updateUser(user2, { state: State.inGame });
    this.sendGameStarted(match.players[0], match, server);
    this.sendGameStarted(match.players[1], match, server);
    console.log('id ==> ', match.id, ' live ==> ', match.live);
    return match;
  }

  async joinGame(id: number, user: IUser) {
    if (this.game[id]) {
      if (
        this.game[id].player1.name !== user.username &&
        this.game[id].player2.name !== user.username
      ) {
        return this.game[id].addSpectatorToGame(user);
      }
    }
  }

  async getGame(id: number) {
    const match = await this.matchService.find(id);
    return {
      match,
      score: [this.game[id].player1.score, this.game[id].player2.score],
    };
  }

  moveTop(id: number, user: IUser) {
    this.game[id].moveTop(user);
  }

  moveBot(id: number, user: IUser) {
    this.game[id].moveBot(user);
  }

  leaveGame(id: number, user: IUser) {
    this.game[id].leaveGame(user);
  }

  async create(user1: IUser, user2: IUser, mode: number): Promise<IMatch> {
    const player1 = await this.playerService.create({
      score: 0,
      elo: user1.elo,
      user: user1,
    });
    if (!player1) return;
    const player2 = await this.playerService.create({
      score: 0,
      elo: user2.elo,
      user: user2,
    });
    if (!player2) {
      await this.playerService.delete(player1.id);
      return;
    }
    return this.matchService.create({
      players: [player1, player2],
      spectators: [],
      mode,
      live: 1,
    });
  }

  async findMatch(id: number): Promise<Match> {
    return this.matchService.find(id);
  }
}
