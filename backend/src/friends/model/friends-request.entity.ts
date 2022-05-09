import { User } from 'src/users/model/user/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity()
export class FriendsRequest {
  /** Id of the owner of the request */
  @PrimaryColumn()
  user: number;

  @ManyToOne(() => User, (user) => user.friendsRequest)
  @JoinColumn()
  userInfo: User;

  /** User target by the friends request*/
  @Column()
  target: number;
}
