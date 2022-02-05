import { Channel } from '../../chat/entities/channel.entity';
import { Friends } from '../../friends/entities/friends.entity';
import { Column, Entity, ManyToMany, OneToMany, PrimaryColumn } from 'typeorm';
import { ConnectedUser } from 'src/chat/entities/connected-user.entity';
import { JoinedChannel } from 'src/chat/entities/joined-channel.entity';
import { Message } from 'src/chat/entities/message.entity';

export enum State {
  online,
  offline,
  inGame,
}

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

  @ManyToMany(() => Channel, (channel) => channel.users)
  channels: Channel[];

  @OneToMany(() => Message, (message) => message.user)
  messages: Message[];

  // -------------  friends

  @ManyToMany(() => Friends, (friendContract) => friendContract.friends)
  friendsReverse: Friends[];
}
