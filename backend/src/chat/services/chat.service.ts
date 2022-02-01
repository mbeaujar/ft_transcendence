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
    private readonly channelRepo: Repository<Channel>,
  ) {}

  async createChannel(channel: IChannel, owner: User): Promise<IChannel> {
    const newChannel = await this.addOwnerToChannel(channel, owner);
    return this.channelRepo.save(newChannel);
  }

  async getChannelForUser(
    userId: number,
    options: IPaginationOptions,
  ): Promise<Pagination<Channel>> {
    const query = this.channelRepo
      .createQueryBuilder('channel')
      .leftJoin('channel.users', 'user')
      .where('user.id =  :userId', { userId });

    return paginate(query, options);
  }

  async addOwnerToChannel(channel: IChannel, owner: User): Promise<IChannel> {
    channel.owner = owner;
    return channel;
  }
}
