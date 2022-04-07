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
    match.players = matchDetails.players;
    return this.matchRepository.save(match);
  }

  async update(match: IMatch, attrs: Partial<Match>): Promise<Match> {
    Object.assign(match, attrs);
    return this.matchRepository.save(match);
  }

  async save(match: IMatch): Promise<Match> {
    return this.matchRepository.save(match);
  }

  async find(id: number): Promise<Match> {
    return this.matchRepository.findOne(id, {
      relations: ['players', 'players.user', 'spectators'],
    });
    // return this.matchRepository
    //   .createQueryBuilder('match')
    //   .leftJoinAndSelect('match.spectators', 'spectator')
    //   .leftJoinAndSelect('match.players', 'players')
    //   .leftJoinAndSelect('players.user', 'user')
    //   .where('match.id = :id', { id })
    //   .getOne();
  }

  async findByUser(userId: number): Promise<Match> {
    return this.matchRepository
      .createQueryBuilder('match')
      .leftJoinAndSelect('match.players', 'player')
      .leftJoinAndSelect('player.user', 'user')
      .where('user.id = :id', { id: userId })
      .getOne();
  }

  async delete(id: number): Promise<DeleteResult> {
    return this.matchRepository.delete(id);
  }
}
