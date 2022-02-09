import { User } from 'src/users/entities/user.entity';

export interface IChannelUser {
  id?: number;
  administrator?: boolean;
  creator?: boolean;
  channelId: number;
  user: User;
}
