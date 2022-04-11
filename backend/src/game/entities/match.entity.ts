import { User } from 'src/users/entities/user.entity';
import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Player } from './player.entity';

@Entity()
export class Match {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => Player, (user) => user.match)
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
