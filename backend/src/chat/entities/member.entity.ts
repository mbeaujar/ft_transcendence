import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Channel } from './channel.entity';

@Entity()
export class Member {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: false })
  admin: boolean;

  // relations

  @ManyToOne(() => User, (user) => user.member)
  user: User;

  @ManyToMany(() => Channel, (channel) => channel.users)
  channels: Channel[];
}
