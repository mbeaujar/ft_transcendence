import { Controller, Get, Post, UseGuards, Request } from '@nestjs/common';
import { FtAuthGuard } from './guards/ft-auth.guard';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('/api/auth/42')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(FtAuthGuard)
  @Post('/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(FtAuthGuard)
  @Get('/callback')
  callback(@Request() req) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
