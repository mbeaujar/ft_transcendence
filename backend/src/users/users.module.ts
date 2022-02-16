import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersService } from './services/user/users.service';
import { AuthModule } from '../auth/auth.module';
import { Friends } from '../friends/model/friends.entity';
import { LocalFile } from './entities/localFile.entity';
import { LocalFilesController } from './controllers/local-files/local-files.controller';
import { UsersController } from './controllers/users/users.controller';
import { LocalFilesService } from './services/local-files/local-files.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Friends, LocalFile]),
    forwardRef(() => AuthModule),
  ],
  controllers: [UsersController, LocalFilesController],
  providers: [UsersService, LocalFilesService],
  exports: [UsersService],
})
export class UsersModule {}
