import { IsString, IsNotEmpty } from 'class-validator';

export class TwoFactorAuthenticationDto {
  @IsString()
  @IsNotEmpty()
  code: string;
}
