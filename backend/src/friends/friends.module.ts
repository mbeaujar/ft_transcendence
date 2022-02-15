import { Module } from '@nestjs/common';
import { FriendsService } from './services/friends.service';
import { FriendsController } from './controllers/friends.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/services/user/users.service';
import { User } from '../users/entities/user.entity';
import { Friends } from './entities/friends.entity';
import { FriendsRequest } from './entities/friends-request.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Friends, FriendsRequest]),
    UsersModule,
  ],
  controllers: [FriendsController],
  providers: [FriendsService, UsersService],
})
export class FriendsModule {}
