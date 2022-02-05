import { IUser } from 'src/users/interface/user.interface';
import { IChannel } from './channel.interface';

export interface IJoinedChannel {
  id?: number;
  socketId: string;
  user: IUser;
  channel: IChannel;
}
