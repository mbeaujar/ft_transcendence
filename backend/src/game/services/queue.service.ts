import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Queue } from '../model/queue/queue.entity';
import { IQueue } from '../model/queue/queue.interface';

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
