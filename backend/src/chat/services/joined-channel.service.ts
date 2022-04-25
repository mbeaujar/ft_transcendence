import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JoinedChannel } from 'src/chat/model/joined-channel/joined-channel.entity';
import { IChannel } from 'src/chat/model/channel/channel.interface';
import { IJoinedChannel } from 'src/chat/model/joined-channel/joined-channel.interface';
import { IUser } from 'src/users/model/user/user.interface';
import { Repository } from 'typeorm';

@Injectable()
export class JoinedChannelService {
  constructor(
    @InjectRepository(JoinedChannel)
    private readonly joinedChannelRepository: Repository<JoinedChannel>,
  ) {}

  async create(joinedChannel: IJoinedChannel): Promise<JoinedChannel> {
    const newJoinedChannel = this.joinedChannelRepository.create(joinedChannel);
    return this.joinedChannelRepository.save(newJoinedChannel);
  }

  async findByUser(user: IUser): Promise<JoinedChannel> {
    return this.joinedChannelRepository.findOne({ user });
  }

  async findByUserAndChannel(
    channel: IChannel,
    user: IUser,
  ): Promise<JoinedChannel> {
    return this.joinedChannelRepository.findOne({
      user,
      channelId: channel.id,
    });
  }

  async findByChannel(channelId: number): Promise<JoinedChannel[]> {
    return this.joinedChannelRepository
      .createQueryBuilder('joinChannel')
      .leftJoinAndSelect('joinChannel.user', 'join_user')
      .where('joinChannel.channelId = :channelId', { channelId })
      .leftJoinAndSelect('join_user.blockedUsers', 'blocked_users')
      .getMany();
  }

  async deleteBySocketId(socketId: string): Promise<any> {
    return this.joinedChannelRepository.delete({ socketId });
  }

  async delete(joinedChannel: IJoinedChannel) {
    return this.joinedChannelRepository.delete(joinedChannel);
  }

  async deleteByChannel(channel: IChannel): Promise<any> {
    return this.joinedChannelRepository.delete({ channelId: channel.id });
  }

  async deleteAll() {
    await this.joinedChannelRepository.createQueryBuilder().delete().execute();
  }
}
