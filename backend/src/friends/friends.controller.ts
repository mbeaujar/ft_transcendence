import { Controller, Get, Query } from '@nestjs/common';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { FriendsService } from './friends.service';

@Controller('friends')
export class FriendsController {
  constructor(
    private friendsService: FriendsService,
    private usersService: UsersService,
  ) {}

  @Get('/add')
  async addFriend(@Query('id') id: string, @CurrentUser() user: User) {
    const cible = await this.usersService.findUser(parseInt(id));
    return this.friendsService.sendFriendRequest(user, cible);
  }
}
