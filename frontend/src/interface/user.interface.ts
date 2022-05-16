export interface IUser {
  id: number;
  username: string;
  avatarDefault?: string;
  avatarId?: number;
  wins: number;
  losses: number;
  isTwoFactorEnabled: boolean;
  elo: number;
  user: IUser;
  state: number;
  blockedUsers: IUser[];
  creator: boolean;
  administrator: boolean;
  mute: boolean;
  sensitivity:number;
}
