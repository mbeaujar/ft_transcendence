import { LocalFileDto } from 'src/users/dtos/local-file.dto';
import { State } from '../state.enum';

export interface IUser {
  id: number;
  username: string;
  sensitivity: number;
  avatarId?: number;
  avatar?: LocalFileDto;
  isTwoFactorEnabled?: boolean;
  state?: State;
  elo: number;
  wins: number;
  losses: number;
  blockedUsers: IUser[];
}
