import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/services/auth.service';
import { ConnectedUser } from 'src/chat/model/connected-user/connected-user.entity';
import { ConnectedUserService } from 'src/chat/services/connected-user/connected-user.service';
import { Friends } from 'src/friends/model/friends.entity';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/services/user/users.service';
import { GameController } from './controllers/game.controller';
import { Match } from './entities/match.entity';
import { Player } from './entities/player.entity';
import { Queue } from './entities/queue.entity';
import { GameGateway } from './gateway/game.gateway';
import { GameService } from './services/game/game.service';
import { MatchService } from './services/match/match.service';
import { PlayerService } from './services/player/player.service';
import { QueueService } from './services/queue/queue.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Friends,
      ConnectedUser,
      Match,
      Player,
      Queue,
    ]),
    AuthModule,
  ],
  controllers: [GameController],
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
