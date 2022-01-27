import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class FriendsTicket {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  ownerId: number;

  @Column()
  cibleId: number;
}
