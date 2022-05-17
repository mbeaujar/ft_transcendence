import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../../../users/model/user/user.entity';

@Entity()
export class Invite {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (owner) => owner)
  owner: User;

  @ManyToOne(() => User, (target) => target.targetInvite)
  target: User;

  @Column()
  mode: number;
}
