import { IChannelUser } from '../channel-user/channel-user.interface';

export interface IChannel {
  id?: number;
  state: number;
  password?: string;
  name: string;
  users: IChannelUser[];
}
