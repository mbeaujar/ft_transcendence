import { Controller, Get, Redirect, Req, UseGuards } from '@nestjs/common';
import { FtAuthGuard } from './guards/ft-auth.guard';
import { AuthenticatedGuard } from './guards/authenticated.guard';
import { Request } from 'express';

@Controller('api/auth')
export class AuthController {

  @Get('login')
  @UseGuards(FtAuthGuard)
  login() {
    return;
  }

  @Get('login/callback')
  @UseGuards(FtAuthGuard)
  @Redirect('/')
  loginCallback() {
    return;
  }

  @UseGuards(AuthenticatedGuard)
  @Get('logout')
  @Redirect('/')
  logout(@Req() req: Request) {
    req.logOut();
  }
}
