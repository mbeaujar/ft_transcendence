import { User } from 'src/users/entities/user.entity';
import { State } from '../entities/channel.entity';

export class IChannel {
  id?: number;
  name?: string;
  state?: State;
  ownerId?: number;
  users: User[];
}
