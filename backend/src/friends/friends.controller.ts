import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
} from '@nestjs/common';
import { ApiBasicAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Auth } from '../auth/decorators/auth.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from 'src/users/model/user/user.entity';
import { DeleteFriendsDto } from './dtos/delete-friends.dto';
import { FriendsRequest } from './model/friends-request.entity';
import { Friends } from './model/friends.entity';
import { FriendsService } from './friends.service';
import { UpdateFriendsDto } from './dtos/update-friends.dto';

@ApiBasicAuth()
@ApiTags('friends')
@Controller('friends')
export class FriendsController {
  constructor(private readonly friendsService: FriendsService) {}

  @Auth()
  @ApiOperation({ summary: 'Send a friend request' })
  @Post('/add')
  async addFriends(
    @Body() body: UpdateFriendsDto,
    @CurrentUser() user: User,
  ): Promise<FriendsRequest | Friends> {
    return this.friendsService.createFriendRequest(user, body.username);
  }

  @Auth()
  @ApiOperation({ summary: 'list of friends' })
  @Get('/list')
  async getAllFriends(@CurrentUser() user: User): Promise<Friends> {
    return this.friendsService.getFriendsList(user.id);
  }

  @Auth()
  @ApiOperation({ summary: 'Get all friends request' })
  @Get('/request')
  async getFriendsRequest(
    @CurrentUser() user: User,
  ): Promise<FriendsRequest[]> {
    return this.friendsService.getFriendsRequest(user.id);
  }

  @Auth()
  @ApiOperation({ summary: 'Delete / Decline friends request' })
  @Post('/refuse')
  async onRequestRefuse(
    @Body() body: DeleteFriendsDto,
    @CurrentUser() user: User,
  ) {
    return this.friendsService.deleteFriendsRequest(body.id, user.id);
  }

  @Auth()
  @Get('/:id')
  async getFriendsList(@Param('id') id: string) {
    let reg = new RegExp('^[0-9]*$');

    if (reg.test(id) === false) {
      throw new BadRequestException('digit only');
    }

    return this.friendsService.getFriendsList(parseInt(id));
  }

  @Auth()
  @ApiOperation({ summary: 'Delete a friendship between users' })
  @Delete('/:id')
  async deleteFriendship(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ): Promise<Friends> {
    let reg = new RegExp('^[0-9]*$');

    if (reg.test(id) === false) {
      throw new BadRequestException('digit only');
    }

    if (id && id !== 'null') {
      return this.friendsService.deleteFriendship(user, parseInt(id));
    }
  }
}
