import { IsNumber } from 'class-validator';

export class BlockUserDto {
  @IsNumber()
  id: number;
}
