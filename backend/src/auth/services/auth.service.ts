import { Injectable } from '@nestjs/common';
import { UserDto } from '../../users/dtos/user.dto';
import { UsersService } from '../../users/services/users.service';
import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(userDetails: UserDto): Promise<User> {
    const user = await this.usersService.findUser(userDetails.id);
    if (!user) {
      return this.usersService.createUser(userDetails);
    }
    return this.usersService.login(user);
    // return user;
  }

  setCookie(res: Response, req: any): void {
    const payload = { username: req.user.username, sub: req.user.id };
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
