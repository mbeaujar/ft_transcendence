import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';
import { Friends } from 'src/friends/entities/friends.entity';
import { User } from 'src/users/entities/user.entity';
import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/users.service';
import { ChatGateway } from './gateway/chat.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([User, Friends]), AuthModule, UsersModule],
  providers: [ChatGateway, AuthService, UsersService],
})
export class ChatModule {}
