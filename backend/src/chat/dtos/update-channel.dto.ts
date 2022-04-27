import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class UpdateChannelDto {
  @IsNumber()
  @IsPositive()
  id: number;

  @IsNumber()
  state: number;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  password?: string;
}
