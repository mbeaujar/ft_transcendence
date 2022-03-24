import { IUser } from 'src/users/interface/user.interface';

export interface IFriends {
  id?: number;
  friends: IUser[];
}
