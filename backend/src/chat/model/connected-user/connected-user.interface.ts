import { IUser } from 'src/users/model/user/user.interface';

export interface IConnectedUser {
  id?: number;
  socketId: string;
  user: IUser;
}
