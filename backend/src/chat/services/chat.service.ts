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

  async createChannel(channel: IChannel, creator: User): Promise<Channel> {
    // const newChannel = await this.addOwnerToChannel(channel, creator);
    const newChannel = this.channelRepo.create({
      ...channel,
      ownerId: creator.id,
    });
    channel.users = [creator];
    const chan = await this.channelRepo.save(newChannel);
    console.log('channel save', chan);
    return chan;
    // return this.channelRepo.save(newChannel);
  }

  async getChannelForUser(
    userId: number,
    options: IPaginationOptions,
  ): Promise<Pagination<Channel>> {
    console.log('userid', userId);
    const query = this.channelRepo
      .createQueryBuilder('channel')
      .where('channel.ownerId = :userId', { userId });
    // .leftJoinAndSelect('channel.users', 'all_users');
    //   .where('owner.id = :userId', { userId })

    // console.log('query', query);
    return paginate(query, options);
  }

  async addOwnerToChannel(channel: IChannel, creator: User): Promise<IChannel> {
    channel.users.push(creator);
    return channel;
  }
}
