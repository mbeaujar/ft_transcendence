import { User } from '../../../users/model/user/user.entity';

export interface IInvite {
  id?: number;
  owner: User;
  target: User;
  mode: number;
}
