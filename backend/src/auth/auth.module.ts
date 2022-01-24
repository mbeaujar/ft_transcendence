import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { FtStrategy } from './strategy/ft.strategy';
import { ConfigService } from '@nestjs/config';
import { SessionSerializer } from './session.serializer';

@Module({
  controllers: [AuthController],
  providers: [ConfigService, FtStrategy, SessionSerializer],
})
export class AuthModule {}
