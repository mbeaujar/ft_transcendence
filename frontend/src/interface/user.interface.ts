export interface IUser {
  id: number;
  username: string;
  avatarDefault?: string;
  avatarId?: number;
  wins: number;
  losses: number;
  isTwoFactorEnabled:boolean;
  elo:number;
  user:any;
  state:number;
}
