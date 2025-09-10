import { ENEMY_SIZE_RATIO, ENEMY_BASE_SPEED_RATIO, ENEMY_VARIANCE_RANGE } from './config.js';

function randRange(a, b) { return a + Math.random() * (b - a); }

function safeRandomY(canvas, h) {
  const halfH = h / 2;
  const top = halfH + 2;
  const bottom = canvas.height - halfH - 2;
  if (bottom <= top) return canvas.height / 2;
  return randRange(top, bottom);
}

export function createEnemy(canvas) {
  const e = {
    x: 0, y: 0, w: 0, h: 0,
    variance: randRange(-ENEMY_VARIANCE_RANGE, ENEMY_VARIANCE_RANGE),
    alive: true,

    updateSize() {
      const base = Math.min(canvas.width, canvas.height);
      const size = Math.max(2, Math.floor(base * ENEMY_SIZE_RATIO));
      this.w = size;
      this.h = Math.floor(size * 0.5);
    },

    spawn() {
      this.updateSize();
      this.x = canvas.width + Math.ceil(this.w / 2) + 2;
      this.y = Math.floor(safeRandomY(canvas, this.h));
      //console.debug('[enemy] spawn @', { x: this.x, y: this.y, w: this.w, h: this.h, variance: this.variance.toFixed(2) });
    },

    currentPixelsPerSec(baseSpeed) {
      const factor = Math.max(0.1, baseSpeed + this.variance);
      return ENEMY_BASE_SPEED_RATIO * Math.min(canvas.width, canvas.height) * factor;
    },

    update(dt, canvas, baseSpeed) {
      this.updateSize();
      this.x -= this.currentPixelsPerSec(baseSpeed) * dt;
      if (this.x + this.w / 2 < 0) this.alive = false;
    },

    render(ctx) {
      ctx.fillStyle = '#ff3b3b';
      ctx.fillRect(this.x - this.w / 2, this.y - this.h / 2, this.w, this.h);
    }
  };

  e.spawn();
  return e;
}
