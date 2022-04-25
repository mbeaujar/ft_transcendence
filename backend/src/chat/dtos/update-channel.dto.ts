import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

export class UpdateChannelDto {
  @IsNumber()
  @IsPositive()
  id: number;

  @IsNumber()
  @IsPositive()
  state: number;

  @IsString()
  @IsNotEmpty()
  password?: string;
}
