import { Module } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { FriendsController } from './friends.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FriendsTicket } from './entities/friends.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FriendsTicket])],
  controllers: [FriendsController],
  providers: [FriendsService],
})
export class FriendsModule {}
