import { IChannel } from './channel.interface';
import { IUser } from './user.interface';

export interface IMessage {
  id?: number;
  text: string;
  user: IUser | null;
  channel?: IChannel;
  created_at?: Date;
  updated_at?: Date;
}
