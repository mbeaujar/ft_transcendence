import { IChannel } from './channel.interface';

export interface IJoinChannel {
  channel: IChannel;
  password?: string;
}
