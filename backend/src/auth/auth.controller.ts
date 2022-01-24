import { Controller, Get, Redirect, Req, UseGuards } from '@nestjs/common';
import { FtAuthGuard } from './guards/ft-auth.guard';
import { AuthenticatedGuard } from './guards/authenticated.guard';
import { Request } from 'express';

@Controller('login')
export class AuthController {
  @Get('42')
  @UseGuards(FtAuthGuard)
  ftAuth() {
    return;
  }

  @Get('42/return')
  @UseGuards(FtAuthGuard)
  @Redirect('/')
  ftAuthCallback() {
    return;
  }

  @Get('logout')
  @Redirect('/login/42/profile')
  logout(@Req() req: Request) {
    req.logOut();
  }

  @UseGuards(AuthenticatedGuard)
  @Get('42/profile')
  getprofile() {
    return 'hello';
  }
}
