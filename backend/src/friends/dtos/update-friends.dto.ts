import { IsString, IsNotEmpty, IsAlpha } from 'class-validator';

export class UpdateFriendsDto {
  @IsString()
  @IsAlpha()
  @IsNotEmpty()
  username: string;
}
