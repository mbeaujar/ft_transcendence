import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { Match } from '../entities/match.entity';
import { IMatch } from '../entities/match.interface';

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(Match)
    private readonly matchsRepository: Repository<Match>,
  ) {}

  async createMatch(matchDetails: IMatch): Promise<Match> {
    const match = this.matchsRepository.create(matchDetails);
    return this.matchsRepository.save(match);
  }

  async updateMatch(match: IMatch, attrs: Partial<Match>): Promise<Match> {
    Object.assign(match, attrs);
    return this.matchsRepository.save(match);
  }

  async deleteMatch(id: number): Promise<DeleteResult> {
    return this.matchsRepository.delete(id);
  }
}
