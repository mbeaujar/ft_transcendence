import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/model/user/user.entity';
import { IUser } from 'src/users/model/user/user.interface';
import { ConfigService } from '@nestjs/config';
import { authenticator } from 'otplib';
import { toFileStream } from 'qrcode';
import { IPayload } from './payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  // --------------------------------------------------------------------------- //

  public async generateTwoFactorAuthenticationSecret(user: User) {
    if (user) {
      const secret = authenticator.generateSecret();

      const otpauthUrl = authenticator.keyuri(
        user.username,
        this.configService.get<string>('TWOFA_SECRET'),
        secret,
      );

      await this.usersService.setTwoFactorAuthenticationSecret(secret, user.id);

      return {
        secret,
        otpauthUrl,
      };
    }
  }

  async pipeQrCodeStream(stream: Response, otpauthUrl: string) {
    return toFileStream(stream, otpauthUrl);
  }

  async isTwoFactorAuthenticationCodeValid(
    twoFactorAuthenticationCode: string,
    user: User,
  ) {
    const secret = await this.usersService.findSecret(user.id);

    return authenticator.verify({
      token: twoFactorAuthenticationCode,
      secret: secret.twoFactorAuthenticationSecret,
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
    // Commentaire Hassan, en dessous tu avais une erreur, dans tous les cas tu renvoyait twoFactorAuthenticatedEnabled a false, j'ai fais ce petit fix, regarde si j'ai pas cassé autre chose

    console.log({ user });
    const payload: IPayload = {
      twoFactorAuthenticatedEnabled: user.isTwoFactorEnabled,
      // juste en dessous ce que tu avais avant
      // twoFactorAuthenticatedEnabled,
      sub: user.id,
    };
    const access_token = this.jwtService.sign(payload);
    res.cookie('access_token', access_token, {
      sameSite: true,
      maxAge: 1000 * 60 * 60 * 24 * 7,
      signed: true,
      secure: true,
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
