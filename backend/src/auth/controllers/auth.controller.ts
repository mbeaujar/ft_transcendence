import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiBasicAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { User } from '../../users/entities/user.entity';
import { AuthService } from '../services/auth.service';
import { Auth } from '../decorators/auth.decorator';
import { CurrentUser } from '../decorators/current-user.decorator';
import { Intra42 } from '../decorators/intra42.decorator';
import { AuthGuard } from '@nestjs/passport';
import { TwoFactorAuthenticationDto } from '../dtos/2fa.dto';
import { JwtService } from '@nestjs/jwt';
import { AuthTwoFactor } from '../decorators/auth-two-factor.decorator';
import { IPayload } from '../interface/payload.interface';

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
    @CurrentUser() user: User,
  ): void {
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
    const isCodeValid = this.authService.isTwoFactorAuthenticationCodeValid(
      body.code,
      user,
    );
    if (!isCodeValid) {
      throw new UnauthorizedException('Wrong authentication code');
    }
    await this.authService.turnOnTwoFactorAuthentication(user);
  }

  @AuthTwoFactor()
  @ApiOperation({ summary: 'Authenticate user with 2FA' })
  @Post('2fa/authenticate')
  async authenticate(
    @Body() body: TwoFactorAuthenticationDto,
    @Res({ passthrough: true }) res: Response,
    @CurrentUser() user: User,
  ) {
    const isCodeValid = this.authService.isTwoFactorAuthenticationCodeValid(
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
    const decodedToken: IPayload = await this.authService.verifyJwt(
      req.cookies.access_token,
    );
    return decodedToken.twoFactorAuthenticatedEnabled;
  }

  @Auth()
  @ApiOperation({ summary: 'Profile of the user authenticated' })
  @Get('status')
  status(@CurrentUser() user: User): User {
    // console.log('user', user);
    return user;
  }

  @AuthTwoFactor()
  @ApiOperation({ summary: 'Logout of 42Api' })
  @Get('logout')
  async logout(
    @Res({ passthrough: true }) res: Response,
    @CurrentUser() user: User,
  ) {
    await this.authService.logout(user);
    res.clearCookie('access_token');
    res.redirect(mainPage);
  }
}

/**
 * cookies: https://www.tutorialspoint.com/expressjs/expressjs_cookies.htm
 */
