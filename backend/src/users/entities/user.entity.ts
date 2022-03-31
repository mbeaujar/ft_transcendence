import { Friends } from '../../friends/model/friends.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { ConnectedUser } from 'src/chat/model/connected-user/connected-user.entity';
import { JoinedChannel } from 'src/chat/model/joined-channel/joined-channel.entity';
import { Message } from 'src/chat/model/message/message.entity';
import { ChannelUser } from 'src/chat/model/channel-user/channel-user.entity';
import { State } from '../interface/state.enum';
import { LocalFile } from './localFile.entity';
import { FriendsRequest } from 'src/friends/model/friends-request.entity';
import { Match } from 'src/game/entities/match.entity';
import { Player } from 'src/game/entities/player.entity';

@Entity()
export class User {
  /** id Api42 */
  @PrimaryColumn()
  id: number;

  @Column({ default: false })
  isTwoFactorEnabled: boolean;

  @Column({ nullable: true })
  twoFactorAuthenticationSecret: string;

  @Column({ unique: true })
  username: string;

  @Column()
  avatarDefault: string;

  @OneToOne(() => LocalFile, { nullable: true })
  @JoinColumn({ name: 'avatarId' })
  avatar: LocalFile;

  @Column({ nullable: true })
  avatarId: number;

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

  @OneToMany(() => FriendsRequest, (friendsRequest) => friendsRequest.userInfo)
  friendsRequest: FriendsRequest[];

  // -------------  friends

  @ManyToMany(() => Friends, (friendContract) => friendContract.friends)
  friendsReverse: Friends[];

  @OneToMany(() => Player, (player) => player.user)
  player: Player;

  @ManyToMany(() => Match, (match) => match.players)
  matchSpectate: Match[];
}
