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
  @IsPositive()
  state: number;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  password?: string;
}
