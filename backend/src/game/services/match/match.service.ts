import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Match } from 'src/game/entities/match.entity';
import { IMatch } from 'src/game/entities/match.interface';
import { DeleteResult, Repository } from 'typeorm';

@Injectable()
export class MatchService {
  constructor(
    @InjectRepository(Match)
    private readonly matchRepository: Repository<Match>,
  ) {}

  async create(matchDetails: IMatch): Promise<Match> {
    const match = this.matchRepository.create(matchDetails);
    return this.matchRepository.save(match);
  }

  async update(match: IMatch, attrs: Partial<Match>): Promise<Match> {
    Object.assign(match, attrs);
    return this.matchRepository.save(match);
  }

  async findOne(id: number): Promise<Match> {
    return this.matchRepository.findOne(id);
  }

  async delete(id: number): Promise<DeleteResult> {
    return this.matchRepository.delete(id);
  }
}
