import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
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
  @JoinColumn()
  user: User;

  @ManyToOne(() => Match, (match) => match.players)
  match: Match;
}
