import { IUser } from 'src/users/model/user/user.interface';
import { IChannel } from '../model/channel/channel.interface';

export interface IUpdateUser {
  channel: IChannel;
  user: IUser;
  milliseconds?: number;
}
