import { BASE, SHIP } from "./config.js";

export class Ship {
  constructor(x, y, color = SHIP.COLOR) {
    this.w = SHIP.W;
    this.h = SHIP.H;
    this.x = x;
    this.y = y;
    this.color = color;
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
    ctx.beginPath();
    ctx.moveTo(-this.w / 2, this.h / 2);
    ctx.lineTo(this.w / 2, 0);
    ctx.lineTo(-this.w / 2, -this.h / 2);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
}

export const MARGIN = 10;

export function clampYToHalf(y, halfIndex) {
  const half = BASE.HEIGHT;
  const H = BASE.HEIGHT * 2;
  if (halfIndex === 0) {
    return Math.max(MARGIN, Math.min(y, half - MARGIN));
  } else {
    return Math.max(half + MARGIN, Math.min(y, H - MARGIN));
  }
}

export function keepInSameHalf(prevY, newY) {
  const halfIndex = prevY < BASE.HEIGHT ? 0 : 1;
  return clampYToHalf(newY, halfIndex);
}

export function transferAcrossHalves(y) {
  const half = BASE.HEIGHT;
  return y < half ? y + half : y - half;
}

export function mirrorYAcrossMid(y) {
  const half = BASE.HEIGHT;
  if (y < half) {
    const d = half - y;
    return half + d;
  } else {
    const d = y - half;
    return half - d;
  }
}
