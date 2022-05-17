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

  async findQueue(target: number, id: number, mode: number): Promise<Queue> {
    return this.queueRepository
      .createQueryBuilder('queue')
      .where('queue.invite = :invite', { invite: 1 })
      .andWhere('queue.mode = :mode', { mode })
      .andWhere('queue.target = :target', { target })
      .leftJoinAndSelect('queue.user', 'user')
      .andWhere('user.id = :id', { id })
      .getOne();
  }

  async findOpponents(id: number, elo: number, mode: number): Promise<Queue> {
    return this.queueRepository
      .createQueryBuilder('queue')
      .where('queue.invite = :invite', { invite: 0 })
      .orderBy('ABS(queue.elo - :elo)', 'DESC')
      .setParameters({ elo })
      .leftJoinAndSelect('queue.user', 'user')
      .andWhere('user.id != :id', { id })
      .andWhere('queue.mode = :mode', { mode })
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
