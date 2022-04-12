import { User } from 'src/users/model/user/user.entity';
import { Player } from '../player/player.entity';

export interface IMatch {
  id?: number;
  players: Player[];
  spectators: User[];
  live: number;
}
