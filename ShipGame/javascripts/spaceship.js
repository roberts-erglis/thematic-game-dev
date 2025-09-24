import { SHIP_SIZE_RATIO } from './config.js';
import { getMoveVector } from './input.js';

export function createSpaceship(canvas) {
  const ship = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    w: 0,
    h: 0,
    speed: () => 0.6 * Math.min(canvas.width, canvas.height),

    updateSize() {
      const base = Math.min(canvas.width, canvas.height);
      const shipWidth = Math.floor(base * SHIP_SIZE_RATIO);
      const shipHeight = Math.floor(shipWidth * 0.5);
      this.w = Math.max(2, shipWidth);
      this.h = Math.max(2, shipHeight);
    },

    update(dt, canvas) {
      this.updateSize();
      const mv = getMoveVector();
      const v = this.speed();
      this.x += mv.x * v * dt;
      this.y += mv.y * v * dt;

      const halfW = this.w / 2;
      const halfH = this.h / 2;
      this.x = Math.min(canvas.width - halfW, Math.max(halfW, this.x));
      this.y = Math.min(canvas.height - halfH, Math.max(halfH, this.y));
    },

    render(ctx) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(this.x - this.w / 2, this.y - this.h / 2, this.w, this.h);
    }
  };

  ship.updateSize();
  return ship;
}
