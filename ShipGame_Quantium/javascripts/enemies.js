import { ENEMY, BASE } from "./config.js";
import { Enemy } from "./enemy.js";

export class Enemies {
  constructor() {
    this.items = [];
    this._timer = 0;
  }

  spawnOne() {
    if (this.items.length >= ENEMY.MAX_COUNT) return;
    const y = Math.random() * (BASE.HEIGHT * 2);
    const x = BASE.WIDTH + 30 + Math.random() * 120;
    this.items.push(new Enemy(x, y));
  }

  update(dt, quantumMode, verticalDelta = 0) {
    this._timer += dt * 1000;
    if (this._timer >= ENEMY.SPAWN_EVERY_MS) {
      this._timer = 0;
      this.spawnOne();
    }

    for (const e of this.items) {
      e.step(dt);
      if (quantumMode && verticalDelta !== 0) {
        e.y += verticalDelta;
      }
      e.wrapVertical();
    }

    this.items = this.items.filter((e) => e.x + e.w / 2 >= -20);
  }

  draw(ctx) {
    for (const e of this.items) e.draw(ctx);
  }
}
