import {
  BadRequestException,
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
import { Response } from 'express';
import { createReadStream, unlink } from 'fs';
import { join } from 'path';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import LocalFilesInterceptor from 'src/users/interceptors/localFiles.interceptor';
import { IUser } from 'src/users/interface/user.interface';
import { LocalFilesService } from 'src/users/services/local-files/local-files.service';
import { UsersService } from 'src/users/services/user/users.service';

@Controller('local-files')
export class LocalFilesController {
  constructor(
    private readonly localFilesService: LocalFilesService,
    private readonly usersService: UsersService,
  ) {}

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
    @CurrentUser() user: IUser,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const avatar = await this.localFilesService.getFileById(user.avatarId);
    if (avatar) {
      const path = join(process.cwd(), avatar.path);
      unlink(path, (err) => {
        if (err) console.log(err);
      });
    }
    const localFile = await this.localFilesService.saveLocalFileData({
      path: file.path,
      filename: file.originalname,
      mimetype: file.mimetype,
    });
    await this.usersService.updateUser(user, { avatarId: localFile.id });
  }

  @Auth()
  @Get('/default/:id')
  async getDefaultAvatar(@Param('id') id: string) {
    if (id === undefined || id === null) return;
    const user = await this.usersService.findUser(parseInt(id));
    return user.avatarDefault;
  }

  @Auth()
  @Get('/:id')
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
