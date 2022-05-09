import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IUser } from 'src/users/model/user/user.interface';
import { DeleteResult, Repository } from 'typeorm';
import { Match } from '../model/match/match.entity';
import { IMatch } from '../model/match/match.interface';

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

  async save(match: IMatch): Promise<Match> {
    return this.matchRepository.save(match);
  }

  async find(id: number): Promise<Match> {
    return this.matchRepository.findOne(id, {
      relations: ['players', 'players.user', 'spectators'],
    });
  }

  async findAllMatch(): Promise<Match[]> {
    return this.matchRepository
      .createQueryBuilder('match')
      .where('match.live = :live', { live: 1 })
      .getMany();
  }

  async findByUser(userId: number): Promise<Match[]> {
    return this.matchRepository
      .createQueryBuilder('match')
      .leftJoinAndSelect('match.players', 'player')
      .leftJoinAndSelect('player.user', 'user')
      .where('user.id = :userId', { userId })
      .orderBy('match.created_at', 'ASC')
      .getMany();
  }

  async userIsPlaying(userId: number): Promise<Match> {
    return this.matchRepository
      .createQueryBuilder('match')
      .leftJoinAndSelect('match.players', 'player') // relation player
      .leftJoinAndSelect('player.user', 'user') // relation user in player
      .where('user.id = :userId', { userId }) // where player.id === userid
      .andWhere('match.live = :live', { live: 1 }) // where match.live === 1
      .getOne();
  }

  async findMatchUser(userId: number): Promise<Match[]> {
    const matchs = await this.findByUser(userId);
    let matchsFilter: Match[] = [];

    for (const match of matchs) {
      const filter = await this.find(match.id);
      if (filter) {
        matchsFilter.push(filter);
      }
    }
    return matchsFilter;
  }

  async delete(id: number): Promise<DeleteResult> {
    return this.matchRepository.delete(id);
  }
}
