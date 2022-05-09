import { applyDecorators, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../guards/jwt.guard';

export function AuthTwoFactor() {
  return applyDecorators(UseGuards(JwtGuard));
}
