import { IUser } from "./user.interface";

interface IPlayers {
  user:IUser;
  elo:number;
  score:number;
}

export interface IGame {
  ballx: number;
  bally: number;
  player1?: number;
  player2?: number;
  paddleh1?: number;
  paddleh2?: number;
  created_at:string;
  players:IPlayers[];
}
