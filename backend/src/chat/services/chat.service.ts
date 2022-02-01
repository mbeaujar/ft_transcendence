import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Channel } from '../entities/channel.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Channel)
    private readonly channelRepo: Repository<Channel>,
  ) {}
}
