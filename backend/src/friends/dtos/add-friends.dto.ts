import { IsNumber } from 'class-validator';

export class AddFriendsDto {
  @IsNumber()
  id: number;
}
