import { IsString, IsNotEmpty, IsAlpha, IsNumberString } from 'class-validator';

export class TwoFactorAuthenticationDto {
  @IsString()
  @IsNotEmpty()
  @IsNumberString()
  code: string;
}
