import { User } from 'src/users/model/user/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Player } from '../player/player.entity';

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

  @Column()
  mode: number;

  @Column()
  live: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
