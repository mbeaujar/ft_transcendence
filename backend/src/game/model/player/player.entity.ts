import { User } from 'src/users/model/user/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Match } from '../match/match.entity';

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
