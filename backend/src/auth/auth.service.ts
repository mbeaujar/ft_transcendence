import { Injectable } from '@nestjs/common';
import { UserDto } from 'src/users/dtos/user.dto';
import { UsersService } from 'src/users/users.service';
import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
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
      httpOnly: true,
    });
  }

  async findUser(id: number): Promise<User | undefined> {
    return this.usersService.findUser(id);
  }

  async logout(user: User) {
    return this.usersService.logout(user);
  }
}
