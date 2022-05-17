import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { IPayload } from '../payload.interface';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtTwoFactorStrategy extends PassportStrategy(
  Strategy,
  'jwt-two-factor',
) {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    super({
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('SECRET_JWT'),
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          // return req?.cookies['access_token'];
          return req?.signedCookies['access_token'];
        },
      ]),
    });
  }

  async validate(payload: IPayload) {
    const user = await this.authService.findUser(payload.sub);
    if (!user) {
      throw new UnauthorizedException();
    }
    if (
      user.isTwoFactorEnabled === true &&
      payload.twoFactorAuthenticatedEnabled === false
    ) {
      throw new UnauthorizedException('2FA not authenticated');
    }
    return user;
  }
}
