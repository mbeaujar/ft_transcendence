export class Player {
  score: number;
  y: number;
  dy: number;

  constructor() {
    this.score = 0;
    this.y = 0;
    this.dy = 1;
  }

  move() {
    this.y += this.dy;
  }

  direction() {
    this.dy *= -1;
  }

  goal() {
    this.score++;
  }
}
