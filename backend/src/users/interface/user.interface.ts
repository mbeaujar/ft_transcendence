import { State } from '../entities/state.enum';

export class IUser {
  id: number;
  username: string;
  avatar: string;
  isTwoFactorEnabled?: boolean;
  state?: State;
  elo?: number;
  wins?: number;
  losses?: number;
  blockedUsers?: IUser[];
}
