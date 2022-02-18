import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/services/auth.service';
import { Friends } from 'src/friends/model/friends.entity';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/services/user/users.service';
import { GameController } from './controllers/game.controller';
import { GameGateway } from './gateway/game.gateway';
import { GameService } from './services/game.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Friends]), AuthModule],
  controllers: [GameController],
  providers: [GameService, GameGateway, UsersService, AuthService],
  exports: [],
})
export class GameModule {}
