import { IsNumber } from 'class-validator';

export class UpdateFriendsDto {
  @IsNumber()
  id: number;
}
