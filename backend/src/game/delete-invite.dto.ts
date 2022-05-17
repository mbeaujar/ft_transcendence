import { IsNumber } from 'class-validator';

export class DeleteInviteDto {
  @IsNumber()
  target: number;
}
