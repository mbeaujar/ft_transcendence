import { Module } from '@nestjs/common';
import { FriendsService } from './services/friends.service';
import { FriendsController } from './controllers/friends.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/services/user/users.service';
import { User } from '../users/entities/user.entity';
import { Friends } from './entities/friends.entity';
import { FriendsRequest } from './entities/friends-request.entity';
import { LocalFileService } from 'src/users/services/local-file/local-file.service';
import { LocalFile } from 'src/users/entities/localFile.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Friends, FriendsRequest, LocalFile]),
    UsersModule,
  ],
  controllers: [FriendsController],
  providers: [FriendsService, UsersService, LocalFileService],
})
export class FriendsModule {}
