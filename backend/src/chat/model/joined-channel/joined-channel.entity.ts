import { User } from 'src/users/model/user/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class JoinedChannel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  socketId: string;

  @Column()
  channelId: number;

  @ManyToOne(() => User, (user) => user.joinedChannels)
  @JoinColumn()
  user: User;
}
