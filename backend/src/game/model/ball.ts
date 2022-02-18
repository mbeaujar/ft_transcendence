export class Ball {
  x: number;
  y: number;
  dx: number;
  dy: number;

  constructor() {
    this.x = 0;
    this.y = 0;
    this.dx = 0;
    this.dy = 0;
  }

  move() {
    this.x += this.dx;
    this.y += this.dy;
  }
}
