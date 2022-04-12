import { HEIGHT, PADDLEH } from './game';

export class Player {
  score: number;
  y: number;
  step: number;

  constructor(playerSensitivity: number) {
    this.score = 0;
    this.y = 200;
    this.step = 20 * playerSensitivity;
  }
  top() {
    if (this.y - PADDLEH / 2 > 0) {
      if (this.y - PADDLEH / 2 - this.step < 0) {
        this.y -= this.step - Math.abs(this.y - PADDLEH / 2 - this.step);
      } else {
        this.y -= this.step;
      }
    }
  }

  bot() {
    if (this.y + PADDLEH / 2 < HEIGHT) {
      if (this.y + PADDLEH / 2 + this.step > HEIGHT) {
        this.y += this.step - (this.y + PADDLEH / 2 + this.step - HEIGHT);
      } else {
        this.y += this.step;
      }
    }
  }

  goal() {
    this.score++;
  }

  reset() {
    this.y = 200;
  }
}
