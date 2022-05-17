import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiBasicAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { User } from 'src/users/model/user/user.entity';
import { AuthService } from './auth.service';
import { Auth } from './decorators/auth.decorator';
import { CurrentUser } from './decorators/current-user.decorator';
import { Intra42 } from './decorators/intra42.decorator';
import { TwoFactorAuthenticationDto } from './2fa.dto';
import { JwtService } from '@nestjs/jwt';
import { AuthTwoFactor } from './decorators/auth-two-factor.decorator';
import { IPayload } from './payload.interface';

export const mainPage = 'http://localhost:8080';

@ApiBasicAuth()
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  @Intra42()
  @ApiOperation({ summary: 'Login using 42Api' })
  @Get('login')
  login(): void {}

  @Intra42()
  @ApiOperation({ summary: 'Redirect to main page' })
  @Get('redirect')
  redirect(
    @Res({ passthrough: true }) res: Response,
    // @Req() req: Request,
    @CurrentUser() user: User,
  ): void {
    // console.log(req);
    this.authService.getCookieWithJwtAcessToken(res, user);
    res.redirect(mainPage);
  }

  @Auth()
  @ApiOperation({ summary: 'Generate QR code 2FA' })
  @Post('2fa/generate')
  async register(@Res() res: Response, @CurrentUser() user: User) {
    const { otpauthUrl } =
      await this.authService.generateTwoFactorAuthenticationSecret(user);
    return this.authService.pipeQrCodeStream(res, otpauthUrl);
  }

  @Auth()
  @ApiOperation({ summary: 'enable 2FA' })
  @Post('2fa/enable')
  async turnOnTwoFactorAuthentication(
    @Body() body: TwoFactorAuthenticationDto,
    @CurrentUser() user: User,
  ) {
    const isCodeValid =
      await this.authService.isTwoFactorAuthenticationCodeValid(
        body.code,
        user,
      );
    if (!isCodeValid) {
      throw new UnauthorizedException('Wrong authentication code');
    }
    await this.authService.turnOnTwoFactorAuthentication(user);
  }

  @Auth()
  @ApiOperation({ summary: 'disable 2FA' })
  @Post('2fa/disable')
  async turnOffTwoFactorAuthentication(
    @Body() body: TwoFactorAuthenticationDto,
    @CurrentUser() user: User,
  ) {
    const isCodeValid =
      await this.authService.isTwoFactorAuthenticationCodeValid(
        body.code,
        user,
      );
    if (!isCodeValid) {
      throw new UnauthorizedException('Wrong authentication code');
    }
    await this.authService.turnOffTwoFactorAuthentication(user);
  }

  @AuthTwoFactor()
  @ApiOperation({ summary: 'Authenticate user with 2FA' })
  @Post('2fa/authenticate')
  async authenticate(
    @Body() body: TwoFactorAuthenticationDto,
    @Res({ passthrough: true }) res: Response,
    @CurrentUser() user: User,
  ) {
    const isCodeValid =
      await this.authService.isTwoFactorAuthenticationCodeValid(
        body.code,
        user,
      );
    if (!isCodeValid) {
      throw new UnauthorizedException('Wrong authentication code');
    }
    this.authService.getCookieWithJwtAcessToken(res, user, true);
  }

  @AuthTwoFactor()
  @ApiOperation({ summary: 'user is 2FA authenticated' })
  @Get('authenticated')
  async isTwoFactorAuthenticated(@Req() req: Request): Promise<boolean> {
    // console.log(req.signedCookies.access_token);
    const decodedToken: IPayload = await this.authService.verifyJwt(
      req.signedCookies.access_token,
    );
    const user = await this.authService.findUser(decodedToken.sub);
    if (!user) {
      throw new NotFoundException('user not found');
    }
    if (user.isTwoFactorEnabled === false) return true;
    return decodedToken.twoFactorAuthenticatedEnabled;
  }

  @Auth()
  @ApiOperation({ summary: 'Profile of the user authenticated' })
  @Get('status')
  status(@CurrentUser() user: User): User {
    return user;
  }

  @AuthTwoFactor()
  @ApiOperation({ summary: 'Logout of 42Api' })
  @Get('logout')
  async logout(
    @Res({ passthrough: true }) res: Response,
    @CurrentUser() user: User,
  ) {
    if (user) {
      await this.authService.logout(user);
      res.clearCookie('access_token');
    }
    res.redirect(mainPage);
  }
}

/**
 * cookies: https://www.tutorialspoint.com/expressjs/expressjs_cookies.htm
 */
