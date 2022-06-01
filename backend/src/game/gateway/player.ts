import { HEIGHT, PADDLEH } from './game';

export class Player {
  score: number;
  name: string;
  y: number;
  step: number;
  paddleh: number;
  draw: boolean;
  leave: boolean;

  constructor(playerSensitivity: number, paddleh: number, name: string) {
    this.score = 0;
    this.y = 200;
    this.paddleh = PADDLEH;
    this.step = 4 * playerSensitivity;
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

  leaveGame() {
    this.leave = true;
  }

  goal() {
    this.score++;
  }

  reset() {
    this.y = 200;
  }
}
