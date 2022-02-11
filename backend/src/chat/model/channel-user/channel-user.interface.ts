import { IUser } from 'src/users/interface/user.interface';
import { IChannel } from '../channel/channel.interface';

export interface IChannelUser {
  id?: number;
  administrator?: boolean;
  creator?: boolean;
  channelId: number;
  user: IUser;
  channel: IChannel;
}
