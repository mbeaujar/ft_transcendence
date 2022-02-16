import { IsNumber } from 'class-validator';

export class DeleteFriendsDto {
  @IsNumber()
  id: number;
}
