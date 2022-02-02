import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Member } from './member.entity';

export enum State {
  public,
  private,
  protected,
}

@Entity()
export class Channel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ default: State.private })
  state: State;

  @Column({ nullable: true })
  password: string;

  @Column()
  ownerId: number;

  // relations

  @ManyToMany(() => Member)
  @JoinTable()
  users: Member[];
}
