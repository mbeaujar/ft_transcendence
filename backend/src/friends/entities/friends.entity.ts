import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Friends {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToMany(() => User, (friend) => friend.friendsReverse, { eager: true })
  @JoinTable()
  friends: User[];
}
