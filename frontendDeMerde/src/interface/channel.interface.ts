import { IUser } from './user.interface';

export interface IChannel {
  id?: number;
  name: string;
  state: number;
  password?: string;
  users: IUser[];
}
