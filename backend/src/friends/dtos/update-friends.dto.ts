import { IsString } from 'class-validator';

export class UpdateFriendsDto {
  @IsString()
  username: string;
}
