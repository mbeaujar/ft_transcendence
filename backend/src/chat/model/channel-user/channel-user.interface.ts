import { IUser } from 'src/users/interface/user.interface';
import { IChannel } from '../channel/channel.interface';

export interface IChannelUser {
  id?: number;
  administrator?: boolean;
  creator?: boolean;
  ban?: boolean;
  mute?: boolean;
  unban_at?: Date;
  unmute_at?: Date;
  channelId: number;
  user: IUser;
  channel: IChannel;
}
