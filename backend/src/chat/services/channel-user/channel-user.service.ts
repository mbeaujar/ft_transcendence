import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChannelUser } from 'src/chat/entities/channel-user.entity';
import { IChannelUser } from 'src/chat/interface/channel-user.interface';
import { IUser } from 'src/users/interface/user.interface';
import { Repository } from 'typeorm';

@Injectable()
export class ChannelUserService {
  constructor(
    @InjectRepository(ChannelUser)
    private readonly channelUserRepository: Repository<ChannelUser>,
  ) {}

  async create(channelUser: IChannelUser): Promise<ChannelUser> {
    const createdChannelUser = this.channelUserRepository.create(channelUser);
    return this.channelUserRepository.save(createdChannelUser);
  }

  async save(channelUser: IChannelUser): Promise<ChannelUser> {
    return this.channelUserRepository.save(channelUser);
  }

  async findByUser(user: IUser) {
    return this.channelUserRepository.find({ user });
  }

  async findByChannelId(channelId: number) {
    return this.channelUserRepository.find({ channelId });
  }

  async delete(id: number) {
    return this.channelUserRepository.delete({ id });
  }

  async deleteByChannelAndUser(channelId: number, user: IUser) {
    return this.channelUserRepository.delete({ channelId, user });
  }
}
