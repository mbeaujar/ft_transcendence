import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Res,
  StreamableFile,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBasicAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SearchUserDto } from 'src/users/dtos/search-user.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { BlockUserDto } from './dtos/block-user.dto';
import { UpdateUsernameDto } from './dtos/update-username.dto';
import { UsersService } from './users.service';
import LocalFilesInterceptor from './interceptors/localFiles.interceptor';
import { join } from 'path';
import { createReadStream, unlink } from 'fs';
import { IUser } from './model/user/user.interface';
import { Response } from 'express';
import { MatchService } from 'src/game/services/match.service';
import { Match } from 'src/game/model/match/match.entity';
import { SensitivityUserDto } from './dtos/sensitivity-user.dto';

@ApiBasicAuth()
@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly matchService: MatchService,
  ) {}

  /** --------------------------- AVATAR -------------------------------- */

  @Post('avatar')
  @Auth()
  @UseInterceptors(
    LocalFilesInterceptor({
      fieldName: 'file',
      path: '/',
      fileFilter: (request: any, file: any, callback: any) => {
        if (!file.mimetype.includes('image')) {
          return callback(
            new BadRequestException('Provide a valid image'),
            false,
          );
        }
        callback(null, true);
      },
      limits: {
        fileSize: Math.pow(1024, 2),
      },
    }),
  )
  async addAvatar(
    @CurrentUser() user: IUser,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const avatar = await this.usersService.getFileById(user.avatarId);
    if (avatar) {
      const path = join(process.cwd(), avatar.path);
      unlink(path, (err) => {
        if (err) console.log(err);
      });
      await this.usersService.deleteFileById(user.avatarId);
    }
    const localFile = await this.usersService.saveLocalFileData({
      path: file.path,
      filename: file.originalname,
      mimetype: file.mimetype,
    });
    await this.usersService.updateUser(user, { avatarId: localFile.id });
  }

  @Auth()
  @Get('/avatar/:id')
  async getDatabaseFileById(
    @Param('id') id: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    console.log('id', id);
    if (id && id != 'null') {
      const file = await this.usersService.getFileById(parseInt(id));
      if (!file) {
        throw new NotFoundException('file not found');
      }
      const stream = createReadStream(join(process.cwd(), file.path));
      response.set({
        'Content-Disposition': `inline; filename="${file.filename}"`,
        'Content-Type': file.mimetype,
      });
      return new StreamableFile(stream);
    }
    const stream = createReadStream(join(process.cwd(), 'assets/default'));
    response.set({
      'Content-Disposition': `inline; filename="default"`,
      'Content-Type': 'image/jpeg',
    });
    return new StreamableFile(stream);
  }

  /** --------------------------- MANAGE USER -------------------------------- */

  @Auth()
  @Post('/search')
  async searchListOfFriends(@Body() body: SearchUserDto) {
    return this.usersService.findUserALIKEWithUsername(body.query);
  }

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
  @Get('history/:id')
  async getHistoryMatch(@Param('id') id: string): Promise<Match[]> {
    return this.matchService.findMatchUser(parseInt(id));
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

  @Auth()
  @Post('/sensitivity')
  async changeSensitivity(
    @Body() body: SensitivityUserDto,
    @CurrentUser() user: IUser,
  ) {
    await this.usersService.changeSensitivity(body.sensitivity, user.id);
  }
}
