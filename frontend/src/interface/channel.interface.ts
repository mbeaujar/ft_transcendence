import { IUser } from './user.interface';

export interface IChannel {
  name: string;
  owner: IUser;
  users?: IUser[];
}
