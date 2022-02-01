import { User } from 'src/users/entities/user.entity';

export class IChannel {
  id?: number;
  name?: string;
  owner?: User;
  administrators?: User[];
  users: User[];
}
