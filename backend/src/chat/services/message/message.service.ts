import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from 'src/chat/entities/message.entity';
import { IChannel } from 'src/chat/interface/channel.interface';
import { IMessage } from 'src/chat/interface/message.interface';
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
      .orderBy('message.created_at', 'ASC')
      .getMany();
  }
}
