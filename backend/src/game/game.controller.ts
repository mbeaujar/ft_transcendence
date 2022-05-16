import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Post,
} from '@nestjs/common';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { IUser } from 'src/users/model/user/user.interface';
import { UsersService } from 'src/users/users.service';
import { InviteService } from './services/invite.service';
import { InviteGameDto } from './invite-game.dto';
import { GameService } from './services/game.service';
import { Invite } from './model/invite/invite.entity';

@Controller('game')
export class GameController {
  constructor(
    private readonly inviteService: InviteService,
    private readonly usersService: UsersService,
  ) {}

  @Auth()
  @Post('/invite')
  async onInviteToPlay(
    @Body() body: InviteGameDto,
    @CurrentUser() user: IUser,
  ) {
    if (body.target === user.id) {
      throw new BadRequestException('invite yourself not authorized');
    }
    const target = await this.usersService.findUser(body.target);
    if (!target) {
      throw new NotFoundException('user not found');
    }
    const invite = await this.inviteService.findInvite(user.id, body.target);
    if (invite) {
      throw new BadRequestException('invite already exist');
    }
    return this.inviteService.create({ owner: user.id, target: target.id });
  }

  @Auth()
  @Get('/invite')
  async getInviteToPlay(@CurrentUser() user: IUser): Promise<Invite[]> {
    const invites = await this.inviteService.findByUser(user.id);
    if (!invites) {
      throw new NotFoundException('invites to user not found');
    }
    return invites;
  }

  @Auth()
  @Post('/accept')
  async acceptInviteToPlay(
    @Body() body: InviteGameDto,
  ): Promise<IUser> {
    const invite = await this.inviteService.find(body.target);
    if (!invite) {
      throw new NotFoundException('invite not found');
    }
    const targetUser = await this.usersService.findUser(invite.owner);
    if (!targetUser) {
      throw new NotFoundException('user who send invite not found');
    }
    await this.inviteService.delete(invite.id);
    // Start game
    return targetUser;
  }
}
