import { IUser } from 'src/users/model/user/user.interface';
import { Mode } from './mode.enum';

export interface IConnectedUser {
  id?: number;
  mode: Mode;
  socketId: string;
  user: IUser;
}
