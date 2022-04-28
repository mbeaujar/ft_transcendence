import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { IChannelUser } from '../model/channel-user/channel-user.interface';

export class CreateChannelDto {
  id?: number;
  state: number;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  password?: string;
  name: string;
  users: IChannelUser[];
}
