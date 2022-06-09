import { IsString, IsNotEmpty, IsAlpha } from 'class-validator';

export class SearchUserDto {
  @IsString()
  @IsAlpha()
  @IsNotEmpty()
  query: string;
}
