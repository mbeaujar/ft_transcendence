import { IUser } from 'src/users/model/user/user.interface';

export interface IFriends {
  id?: number;
  friends: IUser[];
}
