import { IUser } from 'src/users/model/user/user.interface';

export interface IQueue {
  id?: number;
  elo: number;
  user: IUser;
}
