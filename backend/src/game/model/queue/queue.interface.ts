import { IUser } from 'src/users/model/user/user.interface';

export interface IQueue {
  id?: number;
  elo: number;
  mode: number;
  invite: number;
  target: number;
  user: IUser;
}
