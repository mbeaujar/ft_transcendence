import { User } from 'src/users/entities/user.entity';

export class IChannel {
  id?: number;
  name: string;
  state?: number;
  password?: string;
  users: User[];
}
