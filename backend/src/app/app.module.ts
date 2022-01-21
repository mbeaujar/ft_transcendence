import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from 'src/users/user.entity';

// config.get<string>('DB_NAME')

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: process.env.DB_NAME,
      synchronize: true,
      autoLoadEntities: true,
    }),
    UsersModule,
  ],
})
export class AppModule {}

// TypeOrmModule.forRootAsync({
//   inject: [ConfigService],
//   useFactory: (config: ConfigService) => {
//     return {
//       type: 'sqlite',
//       database: config.get<string>('DB_NAME'),
//       synchronize: true,
//       entities: [User],
//     };
//   },
// }),
// TypeOrmModule.forRoot({
//   type: 'sqlite',
//   database: 'db.sqlite',
//   synchronize: true,
//   entities: [User],
// }),
