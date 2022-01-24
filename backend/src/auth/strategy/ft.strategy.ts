import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile, VerifyCallback } from 'passport-42';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FtStrategy extends PassportStrategy(Strategy, '42') {
  constructor(private configService: ConfigService) {
    super({
      clientID: configService.get<string>('FT_CLIENT_ID'),
      clientSecret: configService.get<string>('FT_CLIENT_SECRET'),
      callbackURL: '/api/auth/login/callback',
      passReqToCallback: true,
    });
  }

  /** Call when the user callback on the url in the constructor */
  async validate(
    request: { session: { accessToken: string } },
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    cb: VerifyCallback,
  ): Promise<any> {
    request.session.accessToken = accessToken;
    return cb(null, profile);
  }
}
