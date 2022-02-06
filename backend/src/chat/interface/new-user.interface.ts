import { IUser } from 'src/users/interface/user.interface';
import { IChannel } from './channel.interface';

export interface INewUser {
  channel: IChannel;
  user: IUser;
}
