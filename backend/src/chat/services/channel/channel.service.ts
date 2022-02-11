import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Channel } from 'src/chat/model/channel/channel.entity';
import { IChannel } from 'src/chat/model/channel/channel.interface';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { WsException } from '@nestjs/websockets';
import { IChannelUser } from 'src/chat/model/channel-user/channel-user.interface';
import { ChannelUser } from 'src/chat/model/channel-user/channel-user.entity';
const scrypt = promisify(_scrypt);

@Injectable()
export class ChannelService {
  constructor(
    @InjectRepository(Channel)
    private readonly channelRepository: Repository<Channel>,
  ) {}

  async hashPassword(password: string) {
    const salt = randomBytes(16).toString('hex');
    const hash = (await scrypt(password, salt, 64)) as Buffer;
    return salt + '.' + hash.toString('hex');
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
    if (channel.state === 2) {
      channel.password = await this.hashPassword(channel.password);
    }
    const newChannel = this.channelRepository.create(channel);
    return this.channelRepository.save(newChannel);
  }

  async updateChannel(
    channel: IChannel,
    attrs: Partial<Channel>,
  ): Promise<Channel> {
    Object.assign(channel, attrs);
    return this.channelRepository.save(channel);
  }

  async deleteChannelById(id: number): Promise<any> {
    return this.channelRepository.delete({ id });
  }

  async deleteChannel(channel: IChannel): Promise<any> {
    return this.channelRepository.delete(channel);
  }

  async addUser(channelI: IChannel, user: ChannelUser): Promise<Channel> {
    const channel = await this.channelRepository.findOne(channelI.id, {
      relations: ['users'],
    });
    channel.users.push(user);
    return this.channelRepository.save(channel);
  }

  async getChannel(channelId: number): Promise<Channel> {
    return this.channelRepository.findOne(channelId, {
      relations: ['users'],
      select: ['id', 'state', 'password', 'users', 'name'],
    });
  }

  async getChannels(): Promise<Channel[]> {
    return this.channelRepository
      .createQueryBuilder('channel')
      .leftJoin('channel.users', 'users')
      .leftJoinAndSelect('channel.users', 'all_users')
      .leftJoinAndSelect('all_users.user', 'all_users_info')
      .getMany();
  }

  async getChannelsForUser(userId: number) {
    return this.channelRepository
      .createQueryBuilder('channel')
      .leftJoin('channel.users', 'users')
      .where('users.id = :userId', { userId })
      .leftJoinAndSelect('channel.users', 'all_users')
      .getMany();
  }
}
