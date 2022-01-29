import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class FriendsRequest {
  /** Id of the owner of the request */
  @PrimaryColumn()
  user: number;

  /** User target by the friends request*/
  @Column()
  target: number;
}
