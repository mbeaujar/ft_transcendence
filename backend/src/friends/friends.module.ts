import { Module } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { FriendsController } from './friends.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';
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
