import { IsString } from 'class-validator';

export class SearchUserDto {
  @IsString()
  query: string;
}
