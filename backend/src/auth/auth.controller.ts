import { Controller, Get, Post, UseGuards, Request } from '@nestjs/common';
// import { AuthGuard } from '@nestjs/passport';
import { FtAuthGuard } from './guards/ft-auth.guard';

@Controller('/api/auth/42')
export class AuthController {
  @UseGuards(FtAuthGuard)
  @Post('/login')
  login(@Request() req): any {
    return req.user;
  }

  @Get('/callback')
  callback(): string {
    return 'Hello';
  }

  @Get('/protect')
  checkIfProtect(@Request() req): string {
    return req.user;
  }
}
