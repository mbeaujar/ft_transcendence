import { Ball } from './ball';
import { Player } from './Player';

export class Game {
  player1Point: number;
  player2Point: number;
  ball: Ball;
  player1: Player;
  player2: Player;
  interval: NodeJS.Timer;
  end: boolean;

  constructor() {
    this.player1Point = 0;
    this.player2Point = 0;
    this.interval = setInterval(this.loop.bind(this), 10);
  }

  // interval 10ms
  loop() {
    // fin de game ??
    if (this.player1Point === 10 || this.player2Point === 10) {
      clearInterval(this.interval);
      return;
    }
    console.log('loop', this.player1Point);
    // Ball touche un paddle ?

    // ball touche un mur ?
    this.player1Point++;

    // this.ball.move();
  }

  resetPoint() {
    this.player1Point = 0;
  }
}
