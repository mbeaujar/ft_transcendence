import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersService } from './services/user/users.service';
import { UsersController } from './controllers/users.controller';
import { AuthModule } from '../auth/auth.module';
import { forwardRef } from '@nestjs/common';
import { Friends } from '../friends/entities/friends.entity';
import { LocalFileService } from './services/local-file/local-file.service';
import { LocalFile } from './entities/localFile.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Friends, LocalFile]),
    forwardRef(() => AuthModule),
  ],
  controllers: [UsersController],
  providers: [UsersService, LocalFileService],
  exports: [UsersService],
})
export class UsersModule {}
