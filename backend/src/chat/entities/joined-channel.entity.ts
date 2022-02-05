import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Channel } from './channel.entity';

@Entity()
export class JoinedChannel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  socketId: string;

  @ManyToOne(() => User, (user) => user.joinedChannels)
  @JoinColumn()
  user: User;

  @ManyToOne(() => Channel, (channel) => channel.joinedUsers)
  @JoinColumn()
  channel: Channel;
}
