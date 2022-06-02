import { IsString, IsNotEmpty } from 'class-validator';

export class UpdateFriendsDto {
  @IsString()
  @IsNotEmpty()
  username: string;
}
