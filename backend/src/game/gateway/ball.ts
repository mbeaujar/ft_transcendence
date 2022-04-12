export class Ball {
  x: number;
  y: number;
  dx: number;
  dy: number;
  r: number;

  constructor() {
    this.x = 400;
    this.y = 200;
    this.dx = 10;
    this.dy = 0;
    this.r = 10;
  }

  move() {
    this.x += this.dx;
    this.y += this.dy;
  }

  reset() {
    this.x = 400;
    this.y = 200;
    this.dx = -this.dx;
    this.dy = 0;
  }
}
