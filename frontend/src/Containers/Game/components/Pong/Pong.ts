export class FtPong {
  width: number;
  height: number;
  commitment: boolean;
  intervalId: number;
  ballX: number;
  ballY: number;
  ballDx: number;
  ballDy: number;
  ballR: number;
  ballColor: string;
  player1Top: boolean;
  player1Bottom: boolean;
  player1PaddleW: number;
  player1PaddleH: number;
  player1PaddleY: number;
  player1PointWon: boolean;
  player1Color: string;
  player2Top: boolean;
  player2Bottom: boolean;
  player2PaddleW: number;
  player2PaddleH: number;
  player2PaddleY: number;
  player2PointWon: boolean;
  player2Color: string;
  paddleSpeed: number;

  constructor() {
    this.width = 0;
    this.height = 0;
    this.commitment = true;
    this.intervalId = 0;
    this.ballX = 0;
    this.ballY = 0;
    this.ballDx = 0;
    this.ballDy = 0;
    this.ballR = 0;
    this.ballColor = '';
    this.player1Top = false;
    this.player1Bottom = false;
    this.player1PaddleW = 0;
    this.player1PaddleH = 0;
    this.player1PaddleY = 0;
    this.player1PointWon = false;
    this.player1Color = '';
    this.player2Top = false;
    this.player2Bottom = false;
    this.player2PaddleW = 0;
    this.player2PaddleH = 0;
    this.player2PaddleY = 0;
    this.player2PointWon = true;
    this.player2Color = '';
    this.paddleSpeed = 0;
  }
}
