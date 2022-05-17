import { IsNumber } from 'class-validator';
import { IsPositive } from 'class-validator';

export class InviteGameDto {
  @IsNumber()
  @IsPositive()
  target: number;

  @IsNumber()
  mode: number;
}
