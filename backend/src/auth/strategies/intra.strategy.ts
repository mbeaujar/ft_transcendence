import { Strategy, Profile } from 'passport-42';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { IUser } from 'src/users/model/user/user.interface';

@Injectable()
export class IntraStrategy extends PassportStrategy(Strategy, '42') {
  constructor(private authService: AuthService) {
    super({
      clientID: process.env.INTRA_UID,
      clientSecret: process.env.INTRA_SECRET,
      callbackURL: process.env.INTRA_CALLBACK_URL,
      scope: ['public'],
    });
  }

  async validate(accesToken: string, refreshToken: string, profile: Profile) {
    const user: IUser = {
      username: profile.username,
      id: profile.id,
      avatarDefault: profile.photos[0].value,
      blockedUsers: [],
    };
    return this.authService.validateUser(user);
  }
}
