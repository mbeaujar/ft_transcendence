import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from 'src/auth/auth.module';
import { FriendsModule } from 'src/friends/friends.module';
import { ChatModule } from 'src/chat/chat.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(),
    AuthModule,
    FriendsModule,
    ChatModule,
  ],
  // providers: [JwtStrategy],
})
export class AppModule {}
