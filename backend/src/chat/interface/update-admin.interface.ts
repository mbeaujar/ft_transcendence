import { IChannelUser } from '../model/channel-user/channel-user.interface';
import { IChannel } from '../model/channel/channel.interface';

export interface IUpdateAdmin {
  channel: IChannel;
  user: IChannelUser;
}
