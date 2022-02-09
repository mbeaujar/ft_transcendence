import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Channel } from './channel.entity';

@Entity()
export class ChannelUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  administrator: boolean;

  @Column()
  creator: boolean;

  @Column()
  channelId: number;

  @ManyToOne(() => User, (user) => user.channelUsers)
  @JoinColumn()
  user: User;

  @ManyToMany(() => Channel, (channel) => channel.users)
  channels: Channel[];
}
