import { Member } from './member.interface';

export interface IChannel {
  name: string;
  users: Member[];
}
