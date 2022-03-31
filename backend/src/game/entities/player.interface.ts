import { IUser } from 'src/users/interface/user.interface';

export interface IPlayer {
  id?: number;
  score: number;
  elo: number;
  user: IUser;
}
