import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { Channel } from '../entities/channel.entity';
import { IChannel } from '../interface/channel.interface';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Channel)
    private readonly channelRepository: Repository<Channel>,
  ) {}

  /**
   * Create a channel
   *
   * @param channel
   * @param creator
   * @returns channel save in the db
   */
  async createChannel(channel: IChannel, creator: User): Promise<Channel> {
    channel.users = [creator];
    const newChannel = this.channelRepository.create(channel);
    return this.channelRepository.save(newChannel);
  }

  /**
   * Find the channel with the user
   *
   * @param userId
   * @param options
   * @returns pagination
   */
  async getChannelForUser(
    userId: number,
    options: IPaginationOptions,
  ): Promise<Pagination<Channel>> {
    const query = this.channelRepository
      .createQueryBuilder('channel')
      .leftJoin('channel.users', 'users')
      .where('users.id = :userId', { userId })
      .leftJoinAndSelect('channel.users', 'all_users');

    return paginate(query, options);
  }
}
