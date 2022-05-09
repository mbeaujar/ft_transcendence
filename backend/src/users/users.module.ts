import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { AuthModule } from '../auth/auth.module';
import { Friends } from '../friends/model/friends.entity';
import { LocalFile } from './model/localFile.entity';
import { UsersController } from './users.controller';
import { User } from './model/user/user.entity';
import { Match } from 'src/game/model/match/match.entity';
import { MatchService } from 'src/game/services/match.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Friends, LocalFile, Match]),
    forwardRef(() => AuthModule),
  ],
  controllers: [UsersController],
  providers: [UsersService, MatchService],
  exports: [UsersService],
})
export class UsersModule {}
