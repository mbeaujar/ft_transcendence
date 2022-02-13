import { Friends } from '../../friends/entities/friends.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { ConnectedUser } from 'src/chat/model/connected-user/connected-user.entity';
import { JoinedChannel } from 'src/chat/model/joined-channel/joined-channel.entity';
import { Message } from 'src/chat/model/message/message.entity';
import { ChannelUser } from 'src/chat/model/channel-user/channel-user.entity';
import { State } from './state.enum';

@Entity()
export class User {
  /** id Api42 */
  @PrimaryColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  avatar: string;

  @Column({ default: State.online })
  state: State;

  @Column({ default: 1000 })
  elo: number;

  @Column({ default: 0 })
  wins: number;

  @Column({ default: 0 })
  losses: number;

  /** relations */

  // ------------- chat

  @OneToMany(() => ConnectedUser, (connection) => connection.user)
  connections: ConnectedUser[];

  @OneToMany(() => JoinedChannel, (joinChannel) => joinChannel.user)
  joinedChannels: JoinedChannel[];

  @OneToMany(() => ChannelUser, (channelUser) => channelUser.user)
  channelUsers: ChannelUser[];

  @OneToMany(() => Message, (message) => message.user)
  messages: Message[];

  @ManyToMany(() => User)
  @JoinTable({ joinColumn: { name: 'users_id_1' } })
  blockedUsers: User[];

  // -------------  friends

  @ManyToMany(() => Friends, (friendContract) => friendContract.friends)
  friendsReverse: Friends[];
}
