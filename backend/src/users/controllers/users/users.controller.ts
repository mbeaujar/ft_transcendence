import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { ApiBasicAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SearchUserDto } from 'src/users/dtos/search-user.dto';
import { Auth } from '../../../auth/decorators/auth.decorator';
import { CurrentUser } from '../../../auth/decorators/current-user.decorator';
import { BlockUserDto } from '../../../users/dtos/block-user.dto';
import { UpdateUsernameDto } from '../../../users/dtos/update-username.dto';
import { IUser } from '../../../users/interface/user.interface';
import { LocalFilesService } from '../../../users/services/local-files/local-files.service';
import { UsersService } from '../../../users/services/user/users.service';

@ApiBasicAuth()
@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly localFilesService: LocalFilesService,
  ) {}

  @Auth()
  @Post('/search')
  async searchListOfFriends(@Body() body: SearchUserDto) {}

  @Auth()
  @ApiOperation({ summary: 'block a user' })
  @Post('block')
  async blockUser(@Body() body: BlockUserDto, @CurrentUser() user: IUser) {
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
  async unblockUser(@Body() body: BlockUserDto, @CurrentUser() user: IUser) {
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
    @CurrentUser() user: IUser,
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
  async findUser(@Param('id') id: string): Promise<IUser> {
    const user = await this.usersService.findUser(parseInt(id));
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return user;
  }
}
