import { IUser } from './user.interface';

export interface IFriends {
  id?: number;
  friends: IUser[];
}
