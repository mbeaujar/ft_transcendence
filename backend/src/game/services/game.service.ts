import { Injectable } from '@nestjs/common';
import { IUser } from 'src/users/model/user/user.interface';
import { Match } from '../model/match/match.entity';
import { IMatch } from '../model/match/match.interface';
import { MatchService } from './match.service';
import { PlayerService } from './player.service';

@Injectable()
export class GameService {
  constructor(
    private readonly matchService: MatchService,
    private readonly playerService: PlayerService,
  ) {}

  async create(user1: IUser, user2: IUser): Promise<IMatch> {
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
      live: 1,
    });
  }

  async findMatch(id: number): Promise<Match> {
    return this.matchService.find(id);
  }
}
