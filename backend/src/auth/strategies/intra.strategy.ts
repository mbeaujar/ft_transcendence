import { Strategy, Profile } from 'passport-42';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { UserDto } from '../../users/dtos/user.dto';

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
    const user: UserDto = {
      username: profile.username,
      id: profile.id,
      avatar: profile.photos[0].value,
    };
    return this.authService.validateUser(user);
  }
}
