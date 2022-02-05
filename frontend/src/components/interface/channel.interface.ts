import { IUser } from './user.interface';

export interface IChannel {
  id?: number;
  name: string;
  users: IUser[];
}
