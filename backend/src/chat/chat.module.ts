import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { AuthService } from '../auth/services/auth.service';
import { Friends } from '../friends/entities/friends.entity';
import { User } from '../users/entities/user.entity';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/services/users.service';
import { ChatGateway } from './gateway/chat.gateway';
import { Channel } from './entities/channel.entity';
import { ConnectedUserService } from './services/connected-user/connected-user.service';
import { ConnectedUser } from './entities/connected-user.entity';
import { ChannelService } from './services/channel/channel.service';
import { Message } from './entities/message.entity';
import { JoinedChannel } from './entities/joined-channel.entity';
import { JoinedChannelService } from './services/joined-channel/joined-channel.service';
import { MessageService } from './services/message/message.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Friends,
      Channel,
      ConnectedUser,
      Message,
      JoinedChannel,
    ]),
    AuthModule,
    UsersModule,
  ],
  providers: [
    ChatGateway,
    AuthService,
    UsersService,
    ConnectedUserService,
    ChannelService,
    JoinedChannelService,
    MessageService,
  ],
})
export class ChatModule {}
