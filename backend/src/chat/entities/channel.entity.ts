import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ChannelUser } from './channel-user.entity';
import { Message } from './message.entity';

@Entity()
export class Channel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  state: number;

  @Column({ select: false })
  password: string;

  @Column()
  name: string;

  /** relations */

  @ManyToMany(() => ChannelUser, (user) => user.channels)
  @JoinTable()
  users: ChannelUser[];

  @OneToMany(() => Message, (message) => message.channel)
  messages: Message[];
}
