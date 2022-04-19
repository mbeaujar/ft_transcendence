import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from 'src/chat/model/message/message.entity';
import { IChannel } from 'src/chat/model/channel/channel.interface';
import { IMessage } from 'src/chat/model/message/message.interface';
import { Repository } from 'typeorm';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {}

  async create(message: IMessage): Promise<Message> {
    const newMessage = this.messageRepository.create(message);
    return this.messageRepository.save(newMessage);
  }

  async findMessageByChannel(channel: IChannel) {
    return this.messageRepository
      .createQueryBuilder('message')
      .leftJoin('message.channel', 'channel')
      .where('channel.id = :channelId', { channelId: channel.id })
      .leftJoinAndSelect('message.user', 'user')
      .leftJoinAndSelect('user.blockedUsers', 'message_blocked_users')
      .orderBy('message.created_at', 'ASC')
      .getMany();
  }

  async deleteMessageByChannel(channel: IChannel) {
    return this.messageRepository
      .createQueryBuilder('message')
      .leftJoin('message.channel', 'channel')
      .where('channel.id = :channelId', { channelId: channel.id })
      .delete()
      .execute();
  }
}
