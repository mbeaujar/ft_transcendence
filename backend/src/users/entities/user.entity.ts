import { Friends } from 'src/friends/entities/friends.entity';
import { Column, Entity, ManyToMany, PrimaryColumn } from 'typeorm';

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

  // @OneToMany()
  // channels:

  @ManyToMany(() => Friends, (friendContract) => friendContract.friends)
  friendsReverse: Friends[];
}
