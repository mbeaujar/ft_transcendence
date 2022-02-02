import { IUser } from './user.interface';

export interface Member {
  admin: boolean;
  owner: boolean;
  user: IUser;
}
