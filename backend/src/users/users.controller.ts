import {
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Res,
} from '@nestjs/common';
import { ApiBasicAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@ApiBasicAuth()
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
  ): Promise<void> {
    await this.usersService.deleteUser(user);
    res.clearCookie('access_token');
  }

  @Auth()
  @ApiOperation({ summary: 'Find a user in the database with the id' })
  @Get('/:id')
  async findUser(@Param('id') id: string): Promise<User> {
    const user = await this.usersService.findUser(parseInt(id));
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return user;
  }
}
