import { State } from '../entities/user.entity';

export class IUser {
  id: number;
  username: string;
  avatar: string;
  state?: State;
  elo?: number;
  wins?: number;
  losses?: number;
}
