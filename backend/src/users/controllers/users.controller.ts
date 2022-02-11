import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { ApiBasicAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { Auth } from '../../auth/decorators/auth.decorator';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { User } from '../entities/user.entity';
import { UsersService } from '../services/users.service';

@ApiBasicAuth()
@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

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
