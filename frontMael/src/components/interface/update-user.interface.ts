import { IChannel } from './channel.interface';
import { IUser } from './user.interface';

export interface IUpdateUser {
  channel: IChannel;
  user: IUser;
  milliseconds?: number;
}
