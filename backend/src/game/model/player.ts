import { WIDTH, HEIGHT, PADDLEH, PADDLEW } from './game';

export class Player {
  score: number;
  y: number;
  step: number;

  constructor() {
    this.score = 0;
    this.y = 200;
    this.step = 20;
  }

  top() {
    if (this.y - PADDLEH / 2 > 0) this.y -= this.step;
  }

  bot() {
    if (this.y + PADDLEH / 2 < HEIGHT) this.y += this.step;
  }

  goal() {
    this.score++;
  }

  reset() {
    this.y = 200;
  }
}
