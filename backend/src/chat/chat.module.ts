import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { AuthService } from '../auth/services/auth.service';
import { Friends } from '../friends/entities/friends.entity';
import { User } from '../users/entities/user.entity';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/services/users.service';
import { ChatGateway } from './gateway/chat.gateway';
import { Channel } from './model/channel/channel.entity';
import { ConnectedUserService } from './services/connected-user/connected-user.service';
import { ConnectedUser } from './model/connected-user/connected-user.entity';
import { ChannelService } from './services/channel/channel.service';
import { Message } from './model/message/message.entity';
import { JoinedChannel } from './model/joined-channel/joined-channel.entity';
import { JoinedChannelService } from './services/joined-channel/joined-channel.service';
import { MessageService } from './services/message/message.service';
import { ChannelUserService } from './services/channel-user/channel-user.service';
import { ChannelUser } from './model/channel-user/channel-user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Friends,
      Channel,
      ConnectedUser,
      ChannelUser,
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
    ChannelUserService,
  ],
})
export class ChatModule {}
