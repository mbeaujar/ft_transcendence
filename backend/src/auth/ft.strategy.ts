import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile, VerifyCallback } from 'passport-42';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FtStrategy extends PassportStrategy(Strategy, '42') {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {
    super({
      clientID: configService.get<string>('FT_CLIENT_ID'),
      clientSecret: configService.get<string>('FT_CLIENT_SECRET'),
      callbackURL: 'http://127.0.0.1:3000/api/auth/42/callback',
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
    // request.session.accessToken = accessToken;
    // console.log('accessToken', accessToken, 'refreshToken', refreshToken);
    // In this example, the user's 42 profile is supplied as the user
    // record.  In a production-quality application, the 42 profile should
    // be associated with a user record in the application's database, which
    // allows for account linking and authentication with other identity
    // providers.
    // console.log('request', request);
    // console.log('accessToken', accessToken);
    // console.log('refreshToken', refreshToken);
    // console.log('profile', profile);
    // console.log('cb', cb);
    return cb(null, profile);
    // return null;
  }

  // async validate(
  //   accessToken: string,
  //   refreshToken: string,
  //   profile: Profile,
  //   cb: VerifyCallback,
  // ): Promise<any> {
  //   const user = await this.authService.validateUser(profile)
  // }

  // async validate(username: string, password: string): Promise<any> {
  //   const user = await this.authService.validateUser(username, password);

  //   if (!user) {
  //     throw new UnauthorizedException();
  //   }
  //   return user;
  // }
}
