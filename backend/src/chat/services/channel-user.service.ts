import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChannelUser } from 'src/chat/model/channel-user/channel-user.entity';
import { IChannelUser } from 'src/chat/model/channel-user/channel-user.interface';
import { IChannel } from 'src/chat/model/channel/channel.interface';
import { IUser } from 'src/users/model/user/user.interface';
import { DeleteResult, Repository } from 'typeorm';

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

  async deleteUser(user: IChannelUser): Promise<DeleteResult> {
    return this.channelUserRepository.delete(user);
  }

  async getAdminsInChannel(channel: IChannel): Promise<IChannelUser[]> {
    return this.channelUserRepository.find({
      channelId: channel.id,
      administrator: true,
    });
  }

  async getUsersInChannel(channel: IChannel): Promise<IChannelUser[]> {
    return this.channelUserRepository.find({
      channelId: channel.id,
      ban: false,
    });
  }

  async findUserInChannel(
    channelId: number,
    user: IUser,
  ): Promise<ChannelUser> {
    return this.channelUserRepository.findOne(
      { channelId: channelId, user },
      { relations: ['user', 'channel'] }, // can add channel if needed
    );
  }

  async deleteUserInChannel(
    channelId: number,
    user: IUser,
  ): Promise<DeleteResult> {
    return this.channelUserRepository.delete({ channelId, user });
  }

  async deleteAllUsersInChannel(channelId: number): Promise<DeleteResult> {
    return this.channelUserRepository.delete({ channelId });
  }

  async delete(id: number): Promise<DeleteResult> {
    return this.channelUserRepository.delete({ id });
  }
}
