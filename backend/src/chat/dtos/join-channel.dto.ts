import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { IChannel } from '../model/channel/channel.interface';

export class JoinChannelDto {
  channel: IChannel;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  password?: string;
}
