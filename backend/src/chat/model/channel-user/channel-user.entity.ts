import { User } from 'src/users/model/user/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Channel } from '../channel/channel.entity';

@Entity()
export class ChannelUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  administrator: boolean;

  @Column()
  creator: boolean;

  @Column({ default: false })
  ban: boolean;

  @Column({ default: false })
  mute: boolean;

  @Column()
  channelId: number;

  @Column({ nullable: true })
  unban_at: Date;

  @Column({ nullable: true })
  unmute_at: Date;

  @ManyToOne(() => User, (user) => user.channelUsers)
  @JoinColumn()
  user: User;

  @ManyToOne(() => Channel, (channel) => channel.users)
  @JoinTable()
  channel: Channel;
}
