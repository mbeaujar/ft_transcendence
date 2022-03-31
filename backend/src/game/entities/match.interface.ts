import { User } from 'src/users/entities/user.entity';
import { Player } from './player.entity';

export interface IMatch {
  id?: number;
  players: Player[];
  spectators: User[];
}
