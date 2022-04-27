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
    if (user) {
      const createdUser = this.channelUserRepository.create(user);
      return this.channelUserRepository.save(createdUser);
    }
  }

  async updateUser(userDetails: IChannelUser, attrs: Partial<ChannelUser>) {
    if (userDetails) {
      await this.channelUserRepository.update(userDetails.id, { ...attrs });
    }
  }

  async deleteUser(user: IChannelUser): Promise<DeleteResult> {
    if (user) {
      return this.channelUserRepository.delete(user);
    }
  }

  async getAdminsInChannel(channel: IChannel): Promise<IChannelUser[]> {
    if (channel) {
      return this.channelUserRepository.find({
        channelId: channel.id,
        administrator: true,
      });
    }
  }

  async getUsersInChannel(channel: IChannel): Promise<IChannelUser[]> {
    if (channel) {
      return this.channelUserRepository.find({
        channelId: channel.id,
        ban: false,
      });
    }
  }

  async findUserInChannel(
    channelId: number,
    user: IUser,
  ): Promise<ChannelUser> {
    if (channelId !== undefined && channelId !== null && user) {
      return this.channelUserRepository.findOne(
        { channelId, user },
        { relations: ['user', 'channel'] },
      );
    }
  }

  async deleteUserInChannel(
    channelId: number,
    user: IUser,
  ): Promise<DeleteResult> {
    if (channelId !== undefined && channelId !== null && user) {
      return this.channelUserRepository.delete({ channelId, user });
    }
  }

  async deleteAllUsersInChannel(channelId: number): Promise<DeleteResult> {
    if (channelId !== undefined && channelId !== null) {
      return this.channelUserRepository.delete({ channelId });
    }
  }

  async delete(id: number): Promise<DeleteResult> {
    if (id !== undefined && id !== null) {
      return this.channelUserRepository.delete({ id });
    }
  }
}
