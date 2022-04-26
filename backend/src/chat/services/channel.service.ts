import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Channel } from 'src/chat/model/channel/channel.entity';
import { IChannel } from 'src/chat/model/channel/channel.interface';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { WsException } from '@nestjs/websockets';
import { ChannelUser } from 'src/chat/model/channel-user/channel-user.entity';
import { State } from 'src/chat/interface/state.enum';

const scrypt = promisify(_scrypt);

@Injectable()
export class ChannelService {
  constructor(
    @InjectRepository(Channel)
    private readonly channelRepository: Repository<Channel>,
    @InjectRepository(ChannelUser)
    private readonly channelUserRepository: Repository<ChannelUser>,
  ) {}

  async hashPassword(password: string) {
    if (password) {
      const salt = randomBytes(16).toString('hex');
      const hash = (await scrypt(password, salt, 64)) as Buffer;
      return salt + '.' + hash.toString('hex');
    }
  }

  async verifyPassword(channel: IChannel, password: string) {
    if (!channel) {
      throw new WsException('channel not found');
    }
    const [salt, storedHash] = channel.password.split('.');
    const hash = (await scrypt(password, salt, 64)) as Buffer;
    if (hash.toString('hex') !== storedHash) {
      throw new WsException('wrong password');
    }
  }

  async createChannel(channel: IChannel): Promise<Channel> {
    if (channel.state === State.protected) {
      channel.password = await this.hashPassword(channel.password);
    }
    const newChannel = this.channelRepository.create(channel);
    return this.channelRepository.save(newChannel);
  }

  async updateChannel(
    channel: IChannel,
    attrs: Partial<Channel>,
  ): Promise<Channel> {
    if (channel && attrs) {
      Object.assign(channel, attrs);
      return this.channelRepository.save(channel);
    }
  }

  async deleteChannelById(id: number): Promise<any> {
    if (id) {
      return this.channelRepository.delete({ id });
    }
  }

  async addUser(channelId: IChannel, user: ChannelUser): Promise<Channel> {
    if (channelId && user) {
      const channel = await this.channelRepository.findOne(channelId, {
        relations: ['users'],
      });
      channel.users.push(user);
      return this.channelRepository.save(channel);
    }
  }

  async getChannelByName(name: string): Promise<Channel> {
    if (name) {
      return this.channelRepository.findOne({ name });
    }
  }

  async getChannel(channelId: number): Promise<Channel> {
    if (channelId) {
      return this.channelRepository
        .createQueryBuilder('channel')
        .where('channel.id = :channelId', { channelId })
        .leftJoinAndSelect('channel.users', 'channel_user')
        .leftJoinAndSelect('channel_user.user', 'user')
        .getOne();
    }
  }

  async getChannelWithPassword(channelId: number): Promise<Channel> {
    if (channelId) {
      return this.channelRepository
        .createQueryBuilder('channel')
        .where('channel.id = :channelId', { channelId })
        .leftJoinAndSelect('channel.users', 'channel_user')
        .leftJoinAndSelect('channel_user.user', 'user')
        .select([
          'channel.id',
          'channel.state',
          'channel.password',
          'channel.name',
        ])
        .getOne();
    }
  }

  async getChannelsWithoutDiscussion(): Promise<Channel[]> {
    return this.channelRepository
      .createQueryBuilder('channel')
      .leftJoinAndSelect('channel.users', 'all_users')
      .leftJoinAndSelect('all_users.user', 'all_users_info')
      .where('channel.state != :state', { state: State.discussion })
      .getMany();
  }

  async getChannelsDiscussionForUser(userId: number): Promise<Channel[]> {
    if (userId) {
      return this.channelRepository
        .createQueryBuilder('channel')
        .leftJoinAndSelect('channel.users', 'users')
        .leftJoinAndSelect('users.user', 'user')
        .where('user.id = :userId', { userId })
        .andWhere('channel.state = :state', { state: State.discussion })
        .getMany();
    }
  }

  async getChannels(userId: number): Promise<Channel[]> {
    if (userId) {
      const channels = await this.getChannelsWithoutDiscussion();
      const channelsDiscussion = await this.getChannelsDiscussionForUser(
        userId,
      );
      channels.push(...channelsDiscussion);
      return channels;
    }
  }

  async getChannelsForUser(userId: number): Promise<Channel[]> {
    if (userId) {
      return this.channelRepository
        .createQueryBuilder('channel')
        .leftJoin('channel.users', 'users')
        .leftJoin('users.user', 'user')
        .where('user.id = :userId', { userId })
        .leftJoinAndSelect('channel.users', 'all_users')
        .getMany();
    }
  }
}
