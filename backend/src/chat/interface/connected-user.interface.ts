import { IUser } from 'src/users/interface/user.interface';

export interface IConnectedUser {
  id?: number;
  socketId: string;
  user: IUser;
}
