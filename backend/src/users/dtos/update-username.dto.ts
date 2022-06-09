import { IsString, IsNotEmpty, IsAlpha } from 'class-validator';

export class UpdateUsernameDto {
  @IsString()
  @IsAlpha()
  @IsNotEmpty()
  username: string;
}
