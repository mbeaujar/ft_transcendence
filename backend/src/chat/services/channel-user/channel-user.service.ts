import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChannelUser } from 'src/chat/model/channel-user/channel-user.entity';
import { IChannelUser } from 'src/chat/model/channel-user/channel-user.interface';
import { IChannel } from 'src/chat/model/channel/channel.interface';
import { IUser } from 'src/users/interface/user.interface';
import { Repository } from 'typeorm';

@Injectable()
export class ChannelUserService {
  constructor(
    @InjectRepository(ChannelUser)
    private readonly channelUserRepository: Repository<ChannelUser>,
  ) {}

  async createUser(user: IChannelUser): Promise<ChannelUser> {
    const createdUser = this.channelUserRepository.create(user);
    return this.channelUserRepository.save(createdUser);
  }

  async updateUser(
    userDetails: IChannelUser,
    attrs: Partial<ChannelUser>,
  ): Promise<ChannelUser> {
    Object.assign(userDetails, attrs);
    return this.channelUserRepository.save(userDetails);
  }

  async findUserInChannel(
    channel: IChannel,
    user: IUser,
  ): Promise<ChannelUser> {
    return this.channelUserRepository.findOne(
      { channelId: channel.id, user },
      { relations: ['user', 'channel'] }, // can add channel if needed
    );
  }

  async deleteUserInChannel(channel: IChannel, user: IUser) {
    return this.channelUserRepository.delete({ channelId: channel.id, user });
  }

  async delete(id: number) {
    return this.channelUserRepository.delete({ id });
  }
}
