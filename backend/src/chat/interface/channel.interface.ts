import { ChannelUser } from '../entities/channel-user.entity';

export interface IChannel {
  id?: number;
  state?: number;
  password?: string;
  name: string;
  users: ChannelUser[];
}
