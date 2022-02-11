import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JoinedChannel } from 'src/chat/model/joined-channel/joined-channel.entity';
import { IChannel } from 'src/chat/model/channel/channel.interface';
import { IJoinedChannel } from 'src/chat/model/joined-channel/joined-channel.interface';
import { IUser } from 'src/users/interface/user.interface';
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

  async findByUser(user: IUser): Promise<JoinedChannel[]> {
    return this.joinedChannelRepository.find({ user });
  }

  async findByChannel(channel: IChannel): Promise<JoinedChannel[]> {
    return this.joinedChannelRepository.find({ channelId: channel.id });
  }

  async deleteBySocketId(socketId: string): Promise<any> {
    return this.joinedChannelRepository.delete({ socketId });
  }

  async deleteAll() {
    await this.joinedChannelRepository.createQueryBuilder().delete().execute();
  }
}
