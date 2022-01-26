import { Injectable } from '@nestjs/common';
import { UserDto } from 'src/users/dtos/user.dto';
import { UsersService } from 'src/users/users.service';
import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(userDetails: UserDto): Promise<UserDto> {
    const user = await this.usersService.findUser(userDetails.userId);
    if (!user) {
      return await this.usersService.createUser(userDetails);
    }
    return user;
  }

  setCookie(res: Response, req: any) {
    const payload = { username: req.user.username, sub: req.user.userId };
    res.cookie('access_token', this.jwtService.sign(payload), {
      httpOnly: false,
    });
  }

  async findUser(userId: number): Promise<UserDto | undefined> {
    return this.usersService.findUser(userId);
  }
}
