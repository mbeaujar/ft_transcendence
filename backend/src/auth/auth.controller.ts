import { Controller, Get, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { Auth } from './decorators/auth.decorator';
import { Intra42 } from './decorators/intra42.decorator';

const mainPage = 'http://localhost:8080';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  /**
   * GET /api/auth/login
   * Route call to login
   */
  @Intra42()
  @Get('login')
  login() {}

  /**
   * GET /api/auth/redirect
   * Route call by the OAuth2 Provider and redirect to main page
   */
  @Intra42()
  @Get('redirect')
  redirect(@Res({ passthrough: true }) res: Response, @Req() req: Request) {
    this.authService.setCookie(res, req);
    res.status(302).redirect(mainPage);
  }

  /**
   * GET /api/auth/status
   * Route call to check the status of the authenticate
   */
  // @Auth()
  @Get('status')
  status(@Req() req: Request) {
    return { auth: !(req.cookies == undefined) };
  }

  /**
   * GET /api/auth/logout
   * Route call to logout and redirect to main page
   */
  @Auth()
  @Get('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token');
    res.status(302).redirect(mainPage);
  }
}

/**
 * cookies: https://www.tutorialspoint.com/expressjs/expressjs_cookies.htm
 */
