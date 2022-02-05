import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Channel } from 'src/chat/entities/channel.entity';
import { IChannel } from 'src/chat/interface/channel.interface';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class ChannelService {
  constructor(
    @InjectRepository(Channel)
    private readonly channelRepository: Repository<Channel>,
  ) {}

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

  async getChannelForUser(userId: number) {
    return this.channelRepository
      .createQueryBuilder('channel')
      .leftJoin('channel.users', 'users')
      .where('users.id = :userId', { userId })
      .leftJoinAndSelect('channel.users', 'all_users')
      .getMany();
  }
}
