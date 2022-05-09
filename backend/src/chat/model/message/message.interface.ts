import { IUser } from 'src/users/model/user/user.interface';
import { IChannel } from '../channel/channel.interface';

export interface IMessage {
  id?: number;
  text: string;
  user: IUser;
  channel: IChannel;
  created_at: Date;
  updated_at: Date;
}
