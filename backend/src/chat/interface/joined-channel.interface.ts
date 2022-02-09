import { IUser } from 'src/users/interface/user.interface';
import { IChannel } from './channel.interface';

export interface IJoinedChannel {
  id?: number;
  socketId: string;
  channelId: number;
  user: IUser;
}
