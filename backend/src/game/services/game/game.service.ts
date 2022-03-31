import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IUser } from 'src/users/interface/user.interface';
import { DeleteResult, Repository } from 'typeorm';
import { Match } from '../../entities/match.entity';
import { IMatch } from '../../entities/match.interface';
import { MatchService } from '../match/match.service';
import { PlayerService } from '../player/player.service';

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
    const player2 = await this.playerService.create({
      score: 0,
      elo: user2.elo,
      user: user2,
    });
    return this.matchService.create({
      players: [player1, player2],
      spectators: [],
    });
  }

  async findMatch(id: number): Promise<Match> {
    return this.matchService.findOne(id);
  }
}
