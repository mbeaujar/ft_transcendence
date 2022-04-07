import { User } from 'src/users/entities/user.entity';
import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Player } from './player.entity';

@Entity()
export class Match {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Player, (user) => user.match)
  @JoinColumn()
  players: Player[];

  @ManyToMany(() => User, (user) => user.matchSpectate)
  @JoinTable()
  spectators: User[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
