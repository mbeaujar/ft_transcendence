import { LocalFileDto } from '../dtos/local-file.dto';
import { State } from './state.enum';

export class IUser {
  id: number;
  username: string;
  avatarDefault?: string;
  avatarId?: number;
  avatar?: LocalFileDto;
  isTwoFactorEnabled?: boolean;
  state?: State;
  elo?: number;
  wins?: number;
  losses?: number;
  blockedUsers?: IUser[];
}
