import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { AuthService } from '../auth/auth.service';
import { Friends } from '../friends/model/friends.entity';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';
import { ChatGateway } from './chat.gateway';
import { Channel } from './model/channel/channel.entity';
import { ConnectedUserService } from './services/connected-user.service';
import { ConnectedUser } from './model/connected-user/connected-user.entity';
import { ChannelService } from './services/channel.service';
import { Message } from './model/message/message.entity';
import { JoinedChannel } from './model/joined-channel/joined-channel.entity';
import { JoinedChannelService } from './services/joined-channel.service';
import { MessageService } from './services/message.service';
import { ChannelUserService } from './services/channel-user.service';
import { ChannelUser } from './model/channel-user/channel-user.entity';
import { User } from 'src/users/model/user/user.entity';
import { LocalFile } from 'src/users/model/localFile.entity';

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
      LocalFile,
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
