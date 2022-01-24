import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersService } from '../users/users.service';
import { PassportModule } from '@nestjs/passport';
import { FtStrategy } from './ft.strategy';

@Module({
  imports: [PassportModule],
  providers: [AuthService, FtStrategy, UsersService],
  controllers: [AuthController],
})
export class AuthModule {}
