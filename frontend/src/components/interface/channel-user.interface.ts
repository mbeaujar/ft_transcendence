import { IChannel } from './channel.interface';
import { IUser } from './user.interface';

export interface IChannelUser {
  id?: number;
  administrator?: boolean;
  creator?: boolean;
  ban?: boolean;
  mute?: boolean;
  channelId: number;
  user: IUser;
  channel: IChannel;
}
