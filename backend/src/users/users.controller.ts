import { Controller, Delete, Get, Param, Res } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { FriendsService } from 'src/friends/friends.service';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Auth()
  @ApiOperation({ summary: 'Delete user account' })
  @Delete('delete')
  async deleteUser(
    @CurrentUser() user: User,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.usersService.deleteUser(user);
    res.clearCookie('access_token');
  }

  @Auth()
  @ApiOperation({ summary: 'Find a user in the database with the id' })
  @Get('/:id')
  findUser(@Param('id') id: string) {
    return this.usersService.findUser(parseInt(id));
  }
}
