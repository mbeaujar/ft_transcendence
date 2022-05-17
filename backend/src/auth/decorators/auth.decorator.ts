import { applyDecorators, UseGuards } from '@nestjs/common';
import { JwtTwoFactorGuard } from '../guards/jwt-two-factor.guard';

export function Auth() {
  return applyDecorators(UseGuards(JwtTwoFactorGuard));
}
