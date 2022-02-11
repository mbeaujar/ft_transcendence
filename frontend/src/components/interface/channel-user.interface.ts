import { IChannel } from './channel.interface';
import { IUser } from './user.interface';

export interface IChannelUser {
  id?: number;
  administrator?: boolean;
  creator?: boolean;
  channelId: number;
  user: IUser;
  channel: IChannel;
}
