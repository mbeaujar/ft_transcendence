import { IUser } from 'src/users/model/user/user.interface';
import { IChannel } from '../model/channel/channel.interface';

export interface IDiscussion {
  channel: IChannel;
  user: IUser;
}
