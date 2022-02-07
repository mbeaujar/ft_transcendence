import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { JoinedChannel } from './joined-channel.entity';
import { Message } from './message.entity';

@Entity()
export class Channel {
  @PrimaryGeneratedColumn()
  id: number;

  // @Column('number', { default: 0 })
  @Column()
  state: number;

  // @Column('string', { default: '' })
  @Column({ select: false })
  password: string;

  @Column()
  name: string;

  /** relations */

  @ManyToMany(() => User)
  @JoinTable()
  users: User[];

  @OneToMany(() => JoinedChannel, (joinedUser) => joinedUser.channel)
  joinedUsers: JoinedChannel[];

  @OneToMany(() => Message, (message) => message.channel)
  messages: Message[];
}
