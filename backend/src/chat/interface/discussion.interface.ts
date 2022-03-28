import { IUser } from 'src/users/interface/user.interface';
import { IChannel } from '../model/channel/channel.interface';

export interface IDiscussion {
  channel: IChannel;
  user: IUser;
}
