import { IUser } from './user.interface';

export interface IFriendsRequest {
  user: number;
  userInfo?: IUser;
  target: number;
}
