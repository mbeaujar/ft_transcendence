import { Controller, Get, Req, Res } from '@nestjs/common';
import { ApiBasicAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { UserDto } from 'src/users/dtos/user.dto';
import { AuthService } from './auth.service';
import { Auth } from './decorators/auth.decorator';
import { CurrentUser } from './decorators/current-user.decorator';
import { Intra42 } from './decorators/intra42.decorator';

const mainPage = 'http://localhost:8080';

@ApiBasicAuth()
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Login using 42Api' })
  @Intra42()
  @Get('login')
  login() {}

  @ApiOperation({ summary: 'Redirect to main page' })
  @Intra42()
  @Get('redirect')
  redirect(@Res({ passthrough: true }) res: Response, @Req() req: Request) {
    this.authService.setCookie(res, req);
    res.status(302).redirect(mainPage);
  }

  @ApiOperation({ summary: 'Profile of the user authenticated' })
  @Auth()
  @Get('status')
  status(@CurrentUser() user: UserDto) {
    return user;
  }

  @ApiOperation({ summary: 'Logout of 42Api' })
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
