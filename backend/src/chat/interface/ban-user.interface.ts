import { IUser } from 'src/users/interface/user.interface';
import { IChannel } from '../model/channel/channel.interface';

export interface IBanUser {
  channel: IChannel;
  user: IUser;
}
