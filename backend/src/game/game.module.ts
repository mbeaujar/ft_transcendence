import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { ConnectedUser } from 'src/chat/model/connected-user/connected-user.entity';
import { Friends } from 'src/friends/model/friends.entity';
import { Match } from './model/match/match.entity';
import { Player } from './model/player/player.entity';
import { GameGateway } from './gateway/game.gateway';
import { MatchService } from './services/match.service';
import { QueueService } from './services/queue.service';
import { User } from 'src/users/model/user/user.entity';
import { Queue } from './model/queue/queue.entity';
import { GameService } from './services/game.service';
import { UsersService } from 'src/users/users.service';
import { AuthService } from 'src/auth/auth.service';
import { PlayerService } from './services/player.service';
import { ConnectedUserService } from 'src/chat/services/connected-user.service';
import { LocalFile } from 'src/users/model/localFile.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Friends,
      ConnectedUser,
      Match,
      Player,
      Queue,
      LocalFile,
    ]),
    AuthModule,
  ],
  controllers: [],
  providers: [
    GameService,
    GameGateway,
    UsersService,
    AuthService,
    MatchService,
    PlayerService,
    QueueService,
    ConnectedUserService,
  ],
  exports: [],
})
export class GameModule {}
