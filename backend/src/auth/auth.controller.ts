import { Controller, Get, Post, UseGuards, Request } from '@nestjs/common';
import { AuthenticatedGuard } from './guards/authenticated.guard';
import { FtAuthGuard } from './guards/ft-auth.guard';

@Controller('/api/auth')
export class AuthController {
  @UseGuards(FtAuthGuard)
  @Post('42/login')
  login(@Request() req: any): any {
    return req.user;
  }

  // Redirect to main page
  @UseGuards(FtAuthGuard)
  @Get('42/callback')
  callback(): string {
    return 'Hello';
  }

  @UseGuards(AuthenticatedGuard)
  @Get('42/protected')
  getHello(@Request() req: any): string {
    return req.user;
  }
}
