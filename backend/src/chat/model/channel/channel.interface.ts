import { IChannelUser } from '../channel-user/channel-user.interface';
import { IMessage } from '../message/message.interface';

export interface IChannel {
  id?: number;
  state?: number;
  password?: string;
  name: string;
  users: IChannelUser[];
  messages?: IMessage[];
}
