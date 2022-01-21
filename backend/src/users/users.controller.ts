import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('/ping')
  ping() {
    return 'Pong!';
  }

  @Get('create')
  createUser() {
    return this.usersService.createUser('Mael');
  }
}
