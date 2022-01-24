import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { FtStrategy } from './strategy/ft.strategy';

@Module({
  imports: [UsersModule, PassportModule],
  providers: [AuthService, FtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
