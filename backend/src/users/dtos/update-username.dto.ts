import { IsString, IsNotEmpty } from 'class-validator';

export class UpdateUsernameDto {
  @IsString()
  @IsNotEmpty()
  username: string;
}
