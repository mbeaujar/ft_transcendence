import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { AuthService } from '../auth/services/auth.service';
import { Friends } from '../friends/entities/friends.entity';
import { User } from '../users/entities/user.entity';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/services/users.service';
import { ChatGateway } from './gateway/chat.gateway';
import { ChatService } from './services/chat.service';
import { Channel } from './entities/channel.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Friends, Channel]),
    AuthModule,
    UsersModule,
  ],
  providers: [ChatGateway, AuthService, UsersService, ChatService],
})
export class ChatModule {}
