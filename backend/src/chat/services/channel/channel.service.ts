import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Channel } from 'src/chat/entities/channel.entity';
import { IChannel } from 'src/chat/interface/channel.interface';
import { User } from 'src/users/entities/user.entity';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { WsException } from '@nestjs/websockets';
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

  async createChannel(channel: IChannel, creator: User): Promise<Channel> {
    if (channel.state === 2) {
      channel.password = await this.hashPassword(channel.password);
    }
    channel.users = [creator];
    const newChannel = this.channelRepository.create(channel);
    return this.channelRepository.save(newChannel);
  }

  async getChannel(channelId: number): Promise<Channel> {
    return this.channelRepository.findOne(channelId, {
      relations: ['users'],
      select: ['password'],
    });
  }

  async addUser(channel: IChannel, user: User): Promise<Channel> {
    const channell = await this.channelRepository.findOne(channel.id, {
      relations: ['users'],
    });
    channell.users.push(user);
    return this.channelRepository.save(channell);
  }

  async getAllChannels(): Promise<Channel[]> {
    return this.channelRepository
      .createQueryBuilder('channel')
      .leftJoin('channel.users', 'users')
      .leftJoinAndSelect('channel.users', 'all_users')
      .getMany();
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
