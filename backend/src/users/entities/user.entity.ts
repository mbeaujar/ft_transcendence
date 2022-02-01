import { Channel } from '../../chat/entities/channel.entity';
import { Friends } from '../../friends/entities/friends.entity';
import { Column, Entity, ManyToMany, OneToMany, PrimaryColumn } from 'typeorm';

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

  // relations

  @OneToMany(() => Channel, (channelOwner) => channelOwner.owner)
  channelsOwner: Channel[];

  @ManyToMany(() => Channel, (channelAdmin) => channelAdmin.administrators)
  channelsAdministrator: Channel[];

  @ManyToMany(() => Channel, (channel) => channel.users)
  channels: Channel[];

  @ManyToMany(() => Friends, (friendContract) => friendContract.friends)
  friendsReverse: Friends[];
}
