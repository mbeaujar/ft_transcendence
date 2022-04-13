import { User } from 'src/users/model/user/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Queue {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  elo: number;

  @Column()
  mode: number;

  @Column()
  invite: number;

  @Column()
  target: number;

  @ManyToOne(() => User, (user) => user.queuePlayer)
  user: User;
}
