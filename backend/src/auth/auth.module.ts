import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { IntraStrategy } from './strategies/intra.strategy';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtTwoFactorStrategy } from './strategies/jwt-two-factor.strategy';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    PassportModule.register({}),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('SECRET_JWT'),
        signOptions: { expiresIn: 86400 },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, IntraStrategy, JwtStrategy, JwtTwoFactorStrategy],
  exports: [JwtModule, JwtStrategy, PassportModule, AuthService],
})
export class AuthModule {}
