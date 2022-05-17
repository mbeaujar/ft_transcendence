import { HEIGHT, PADDLEH } from './game';

export class Player {
  score: number;
  y: number;
  step: number;
  paddleh: number;
  draw: boolean;

  constructor(playerSensitivity: number, paddleh: number) {
    this.score = 0;
    this.y = 200;
    this.paddleh = PADDLEH;
    this.step = 20 * playerSensitivity;
    this.draw = true;
  }

  top() {
    if (this.y - this.paddleh / 2 > 0) {
      if (this.y - this.paddleh / 2 - this.step < 0) {
        this.y -= this.step - Math.abs(this.y - this.paddleh / 2 - this.step);
      } else {
        this.y -= this.step;
      }
    }
  }

  bot() {
    if (this.y + this.paddleh / 2 < HEIGHT) {
      if (this.y + this.paddleh / 2 + this.step > HEIGHT) {
        this.y += this.step - (this.y + this.paddleh / 2 + this.step - HEIGHT);
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
