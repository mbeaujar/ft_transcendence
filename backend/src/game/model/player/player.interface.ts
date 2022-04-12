import { IUser } from 'src/users/model/user/user.interface';

export interface IPlayer {
  id?: number;
  score: number;
  elo: number;
  user: IUser;
}
