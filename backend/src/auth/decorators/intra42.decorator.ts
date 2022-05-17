import { applyDecorators, UseGuards } from '@nestjs/common';
import { IntraGuard } from '../guards/intra.guard';

export function Intra42() {
  return applyDecorators(UseGuards(IntraGuard));
}
