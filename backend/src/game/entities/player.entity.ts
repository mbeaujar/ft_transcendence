import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Match } from './match.entity';

@Entity()
export class Player {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  score: number;

  @Column()
  elo: number;

  @ManyToOne(() => User, (user) => user.player)
  @JoinTable()
  user: User;

  @OneToMany(() => Match, (match) => match.players)
  match: Match;
}
