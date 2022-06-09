import {
  IsAlpha,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { IChannelUser } from '../model/channel-user/channel-user.interface';

export class CreateChannelDto {
  @IsOptional()
  id?: number;

  @IsNumber()
  @Max(3)
  @Min(0)
  state: number;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  password?: string;

  @IsString()
  @IsAlpha()
  @IsNotEmpty()
  name: string;

  users: IChannelUser[];
}
