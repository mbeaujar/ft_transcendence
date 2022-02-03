import { Member } from './member.interface';
import { IUser } from './user.interface';

export interface IChannel {
  name: string;
  users: IUser[];
}
