import { IUser } from 'src/users/interface/user.interface';
import { IChannel } from '../model/channel/channel.interface';

export interface IUpdateUser {
  channel: IChannel;
  user: IUser;
  milliseconds?: number;
}
