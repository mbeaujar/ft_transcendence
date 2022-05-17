import { IChannel } from '../model/channel/channel.interface';

export interface IJoinChannel {
  channel: IChannel;
  password?: string;
}

// transform to dto for more security
