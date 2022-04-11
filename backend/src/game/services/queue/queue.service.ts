import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Queue } from 'src/game/entities/queue.entity';
import { IQueue } from 'src/game/entities/queue.interface';
import { DeleteResult, Repository } from 'typeorm';

@Injectable()
export class QueueService {
  constructor(
    @InjectRepository(Queue)
    private readonly queueRepository: Repository<Queue>,
  ) {}

  async create(queueDetails: IQueue): Promise<Queue> {
    const queue = this.queueRepository.create(queueDetails);
    return this.queueRepository.save(queue);
  }

  async findOpponents(id: number, elo: number): Promise<Queue> {
    return this.queueRepository
      .createQueryBuilder('queue')
      .orderBy('ABS(queue.elo - :elo)', 'DESC')
      .setParameters({ elo })
      .limit(1)
      .leftJoinAndSelect('queue.user', 'user')
      .where('user.id != :id', { id })
      .getOne();
  }

  async find(id: number): Promise<Queue> {
    return this.queueRepository
      .createQueryBuilder('queue')
      .leftJoinAndSelect('queue.user', 'user')
      .where('user.id = :id', { id })
      .getOne();
  }

  async update(queue: IQueue, attrs: Partial<Queue>): Promise<Queue> {
    Object.assign(queue, attrs);
    return this.queueRepository.save(queue);
  }

  async delete(id: number) {
    return this.queueRepository
      .createQueryBuilder('queue')
      .leftJoin('queue.user', 'user')
      .where('user.id = :id', { id })
      .delete()
      .execute();
  }
}
