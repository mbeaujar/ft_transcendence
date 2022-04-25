import { IsNotEmpty, IsString } from 'class-validator';
import { IChannel } from '../model/channel/channel.interface';

export class JoinChannelDto {
  channel: IChannel;

  @IsString()
  @IsNotEmpty()
  password?: string;
}
