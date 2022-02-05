import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Channel } from 'src/chat/entities/channel.entity';
import { IChannel } from 'src/chat/interface/channel.interface';
import { User } from 'src/users/entities/user.entity';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';

@Injectable()
export class ChannelService {
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

  async getChannel(channelId: number): Promise<Channel> {
    return this.channelRepository.findOne(channelId, {
      relations: ['users'],
    });
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
