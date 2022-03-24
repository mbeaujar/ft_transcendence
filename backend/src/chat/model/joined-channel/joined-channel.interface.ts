import { IUser } from 'src/users/interface/user.interface';

export interface IJoinedChannel {
  id?: number;
  socketId: string;
  channelId: number;
  user: IUser;
}
