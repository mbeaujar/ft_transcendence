import { Friends } from 'src/friends/entities/friends.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  /** id Api42 */
  @PrimaryColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  avatar: string;

  @Column({ default: 0 })
  friendsId: number;

  @ManyToMany(() => Friends, (friendContract) => friendContract.friends)
  friendsReverse: Friends[];
}
