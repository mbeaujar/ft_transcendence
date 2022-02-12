import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { ApiBasicAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { Auth } from '../../auth/decorators/auth.decorator';
import { BlockUserDto } from '../dtos/block-user.dto';
import { UpdateUsernameDto } from '../dtos/update-username.dto';
import { User } from '../entities/user.entity';
import { UsersService } from '../services/users.service';

@ApiBasicAuth()
@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Auth()
  @ApiOperation({ summary: 'block a user' })
  @Post('block')
  async blockUser(@Body() body: BlockUserDto, @CurrentUser() user: User) {
    const currentUser = await this.usersService.findUser(user.id);
    if (!currentUser) {
      throw new NotFoundException('user not found');
    }
    const blockedUser = await this.usersService.findUser(body.id);
    if (!blockedUser) {
      throw new NotFoundException('user to block not found');
    }
    currentUser.blockedUsers.push(blockedUser);
    return this.usersService.saveUser(currentUser);
  }

  @Auth()
  @ApiOperation({ summary: 'unblock a user' })
  @Post('unblock')
  async unblockUser(@Body() body: BlockUserDto, @CurrentUser() user: User) {
    const currentUser = await this.usersService.findUser(user.id);
    if (!currentUser) {
      throw new NotFoundException('user not found');
    }
    const blockedUser = await this.usersService.findUser(body.id);
    if (!blockedUser) {
      throw new NotFoundException('user to block not found');
    }
    const index = currentUser.blockedUsers.findIndex(
      (blockeduser) => blockeduser.id === blockedUser.id,
    );
    currentUser.blockedUsers.splice(index, 1);
    return this.usersService.saveUser(currentUser);
  }

  @Auth()
  @ApiOperation({ summary: 'Change the username' })
  @Post('username')
  async changeUsername(
    @Body() body: UpdateUsernameDto,
    @CurrentUser() user: User,
  ) {
    const currentUser = await this.usersService.findUser(user.id);
    if (!currentUser) {
      throw new NotFoundException('user not found');
    }
    return this.usersService.updateUser(currentUser, {
      username: body?.username,
    });
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
