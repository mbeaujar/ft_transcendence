import { User } from '../../users/entities/user.entity';
import { Entity, JoinTable, ManyToMany, PrimaryColumn } from 'typeorm';

@Entity()
export class Friends {
  @PrimaryColumn()
  id: number;

  @ManyToMany(() => User, (friend) => friend.friendsReverse, { eager: true })
  @JoinTable()
  friends: User[];
}
