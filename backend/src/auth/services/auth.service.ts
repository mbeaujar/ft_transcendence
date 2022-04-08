import { Injectable } from '@nestjs/common';
import { UsersService } from '../../users/services/user/users.service';
import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../users/entities/user.entity';
import { IUser } from 'src/users/interface/user.interface';
import { ConfigService } from '@nestjs/config';
import { authenticator } from 'otplib';
import { toFileStream } from 'qrcode';
import { IPayload } from '../interface/payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  // --------------------------------------------------------------------------- //

  public async generateTwoFactorAuthenticationSecret(user: User) {
    const secret = authenticator.generateSecret();

    const otpauthUrl = authenticator.keyuri(
      user.username,
      this.configService.get<string>('2FA_SECRET'),
      secret,
    );

    await this.usersService.setTwoFactorAuthenticationSecret(secret, user.id);

    return {
      secret,
      otpauthUrl,
    };
  }

  async pipeQrCodeStream(stream: Response, otpauthUrl: string) {
    return toFileStream(stream, otpauthUrl);
  }

  isTwoFactorAuthenticationCodeValid(
    twoFactorAuthenticationCode: string,
    user: User,
  ) {
    return authenticator.verify({
      token: twoFactorAuthenticationCode,
      secret: user.twoFactorAuthenticationSecret,
    });
  }

  async turnOnTwoFactorAuthentication(user: User) {
    return this.usersService.turnOnTwoFactorAuthentication(user.id);
  }

  async turnOffTwoFactorAuthentication(user: User) {
    return this.usersService.turnOffTwoFactorAuthentication(user.id);
  }

  // --------------------------------------------------------------------------- //

  async validateUser(userDetails: IUser): Promise<User> {
    const user = await this.usersService.findUser(userDetails.id);
    if (!user) {
      return this.usersService.createUser(userDetails);
    }
    return this.usersService.login(user);
  }

  getCookieWithJwtAcessToken(
    res: Response,
    user: User,
    twoFactorAuthenticatedEnabled: boolean = false,
  ) {
    const payload: IPayload = { twoFactorAuthenticatedEnabled, sub: user.id };
    const access_token = this.jwtService.sign(payload);
    res.cookie('access_token', access_token, {
      httpOnly: false,
    });
  }

  async findUser(id: number): Promise<User | undefined> {
    return this.usersService.findUser(id);
  }

  async logout(user: User) {
    return this.usersService.logout(user);
  }

  async verifyJwt(jwt: string): Promise<any> {
    return this.jwtService.verify(jwt);
  }
}
