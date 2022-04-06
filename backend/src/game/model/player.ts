import { WIDTH, HEIGHT, PADDLEH, PADDLEW } from './game';

export class Player {
  score: number;
  y: number;

  constructor() {
    this.score = 0;
    this.y = 200;
  }

  top() {
    if (this.y > PADDLEH / 2) this.y--;
  }

  bot() {
    if (this.y < HEIGHT - PADDLEH / 2) this.y++;
  }

  goal() {
    this.score++;
  }
}
