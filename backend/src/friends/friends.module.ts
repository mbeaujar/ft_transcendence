import { Module } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { FriendsController } from './friends.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';
import { Friends } from './model/friends.entity';
import { FriendsRequest } from './model/friends-request.entity';
import { User } from 'src/users/model/user/user.entity';
import { LocalFile } from 'src/users/model/localFile.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Friends, FriendsRequest, LocalFile]),
    UsersModule,
  ],
  controllers: [FriendsController],
  providers: [FriendsService, UsersService],
})
export class FriendsModule {}
