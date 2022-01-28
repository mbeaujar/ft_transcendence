import { Controller, Delete, Get, Param } from '@nestjs/common';
import { ApiBasicAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { FriendsService } from './friends.service';

@ApiBasicAuth()
@ApiTags('friends')
@Controller('friends')
export class FriendsController {
  constructor(private friendsService: FriendsService) {}

  @Auth()
  @ApiOperation({ summary: 'send friends request' })
  @Get('/add/:id')
  async addFriends(@Param('id') id: string, @CurrentUser() user: User) {
    return this.friendsService.sendFriendsRequest(user, parseInt(id));
  }

  @Auth()
  @ApiOperation({ summary: 'Delete friends or friends request' })
  @Delete('/:id')
  async deleteFriends(@Param('id') id: string, @CurrentUser() user: User) {
    return this.friendsService.deleteTicket(user.id, parseInt(id));
  }

  @Auth()
  @ApiOperation({ summary: 'Friends list' })
  @Get('/all')
  async getAllFriends(@CurrentUser() user: User) {
    const list = await this.friendsService.getAllFriends(user);
    return list;
  }
}
