import { User } from 'src/users/model/user/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class ConnectedUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  socketId: string;

  @Column()
  mode: number;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => User, (user) => user.connections)
  @JoinColumn()
  user: User;
}
