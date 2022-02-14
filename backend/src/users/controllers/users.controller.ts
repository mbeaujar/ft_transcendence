import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Res,
  StreamableFile,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBasicAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { Auth } from '../../auth/decorators/auth.decorator';
import { BlockUserDto } from '../dtos/block-user.dto';
import { UpdateUsernameDto } from '../dtos/update-username.dto';
import { User } from '../entities/user.entity';
import { UsersService } from '../services/user/users.service';
import LocalFilesInterceptor from '../interceptors/localFiles.interceptor';
import { createReadStream, fstat, unlink } from 'fs';
import { join } from 'path';
import { Response } from 'express';
import { LocalFileService } from '../services/local-file/local-file.service';

@ApiBasicAuth()
@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly localFilesService: LocalFileService,
  ) {}

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

  @Post('avatar')
  @Auth()
  @UseInterceptors(
    LocalFilesInterceptor({
      fieldName: 'file',
      path: '/avatars',
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
    @CurrentUser() user: User,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const avatar = await this.usersService.findAvatar(user.avatarId);
    if (avatar) {
      const path = join(process.cwd(), avatar.path);
      unlink(path, (err) => {
        if (err) throw err;
      });
      await this.usersService.deleteAvatar(user.id);
    }
    return this.usersService.addAvatar(user.id, {
      path: file.path,
      filename: file.originalname,
      mimetype: file.mimetype,
    });
  }

  @Auth()
  @Get('/avatar/default')
  async getDefaultAvatar(@CurrentUser() user: User) {
    return user.avatarDefault;
  }

  @Auth()
  @Get('/avatar/:id')
  async getDatabaseFileById(
    @Param('id', ParseIntPipe) id: number,
    @Res({ passthrough: true }) response: Response,
  ) {
    const file = await this.localFilesService.getFileById(id);
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
}
