import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Invite {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  owner: number;

  @Column()
  target: number;

  @Column()
  mode: number;
}
