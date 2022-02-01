import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Channel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => User, (owner) => owner.channelsOwner)
  owner: User;

  @ManyToMany(() => User)
  @JoinTable()
  administrators: User[];

  @ManyToMany(() => User)
  @JoinTable()
  users: User[];
}
