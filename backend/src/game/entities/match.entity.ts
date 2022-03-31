import { User } from 'src/users/entities/user.entity';
import { Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Player } from './player.entity';

@Entity()
export class Match {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Player, (user) => user.match)
  players: Player[];

  @ManyToMany(() => User, (user) => user.matchSpectate)
  spectators: User[];
}
