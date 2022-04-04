import { IUser } from 'src/users/interface/user.interface';

export interface IQueue {
  id?: number;
  elo: number;
  user: IUser;
}
