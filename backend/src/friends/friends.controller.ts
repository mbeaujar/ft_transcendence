import {
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
} from '@nestjs/common';
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
  @ApiOperation({ summary: 'Send a friend request' })
  @Get('/add/:id')
  async addFriends(@Param('id') id: string, @CurrentUser() user: User) {
    return this.friendsService.createFriendRequest(user, parseInt(id));
  }

  @Auth()
  @ApiOperation({ summary: 'list of friends' })
  @Get('/all')
  async getAllFriends(@CurrentUser() user: User) {
    return this.friendsService.getFriendsList(user.friendsId);
  }

  @Auth()
  @Delete('/:id')
  async deleteFriendship(@Param('id') id: string, @CurrentUser() user: User) {}
}
