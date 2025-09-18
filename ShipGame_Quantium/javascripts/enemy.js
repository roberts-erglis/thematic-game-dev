import { ENEMY, BASE } from "./config.js";

export class Enemy {
  constructor(x, y) {
    this.w = ENEMY.W;
    this.h = ENEMY.H;
    this.x = x;
    this.y = y;
    this.vx = -ENEMY.SPEED_X;
    this.color = ENEMY.COLOR;
  }

  get rect() {
    return {
      left: this.x - this.w / 2,
      top: this.y - this.h / 2,
      right: this.x + this.w / 2,
      bottom: this.y + this.h / 2,
    };
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.fillStyle = this.color;
    ctx.fillRect(-this.w / 2, -this.h / 2, this.w, this.h);
    ctx.restore();
  }

  step(dt) {
    this.x += this.vx * dt;
  }

  wrapVertical() {
    const H = BASE.HEIGHT * 2;
    if (this.y < 0) this.y = H;
    if (this.y > H) this.y = 0;
  }
}
