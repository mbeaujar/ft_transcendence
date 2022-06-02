import { IsString, IsNotEmpty } from 'class-validator';

export class SearchUserDto {
  @IsString()
  @IsNotEmpty()
  query: string;
}
