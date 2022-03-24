import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '../auth/auth.module';
import { FriendsModule } from '../friends/friends.module';
import { ChatModule } from '../chat/chat.module';
import { GameModule } from 'src/game/game.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(),
    AuthModule,
    FriendsModule,
    ChatModule,
    GameModule,
  ],
})
export class AppModule {}
