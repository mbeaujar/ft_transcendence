import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from 'src/users/user.entity';

@Module({
  imports: [
    /** Setup .env */
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    /** Setup ormconfig.js */
    TypeOrmModule.forRoot(),
    UsersModule,
  ],
})
export class AppModule {}
