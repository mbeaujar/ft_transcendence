import { IChannelUser } from '../channel-user/channel-user.interface';
import { IMessage } from '../message/message.interface';
import { IsString } from 'class-validator';
import { MinLength } from 'class-validator';
import { MaxLength } from 'class-validator';

export interface IChannel {
  id?: number;
  state?: number;
  password?: string;
  name: string;
  users: IChannelUser[];
  messages?: IMessage[];
}

// transform to dto for more security
