import { IUser } from 'src/users/model/user/user.interface';

export interface IJoinedChannel {
  id?: number;
  socketId: string;
  channelId: number;
  user: IUser;
}
