import {
  BULLET_SIZE_RATIO,
  BULLET_SPEED_RATIO,
  BULLET_COOLDOWN_SEC,
  BULLET_MAGAZINE_SIZE,
  BULLET_RELOAD_INTERVAL_SEC,
} from './config.js';

export function createBullets(canvas) {
  const state = {
    list: [],
    cooldownLeft: 0,
    magazine: BULLET_MAGAZINE_SIZE,
    reloadAcc: 0,

    canFire() {
      return this.cooldownLeft <= 0 && this.magazine > 0;
    },

    fireFrom(ship) {
      if (!this.canFire()) return false;

      const base = Math.min(canvas.width, canvas.height);
      const size = Math.max(2, Math.floor(base * BULLET_SIZE_RATIO));
      const speed = base * BULLET_SPEED_RATIO;

      this.list.push({
        x: ship.x + ship.w / 2 + size / 2,
        y: ship.y,
        w: size,
        h: size,
        v: speed,
        alive: true,
      });

      this.magazine--;
      this.cooldownLeft = BULLET_COOLDOWN_SEC;
      return true;
    },

    update(dt, canvas) {
      if (this.cooldownLeft > 0) this.cooldownLeft = Math.max(0, this.cooldownLeft - dt);

      if (this.magazine < BULLET_MAGAZINE_SIZE) {
        this.reloadAcc += dt;
        while (this.reloadAcc >= BULLET_RELOAD_INTERVAL_SEC && this.magazine < BULLET_MAGAZINE_SIZE) {
          this.magazine++;
          this.reloadAcc -= BULLET_RELOAD_INTERVAL_SEC;
        }
      } else {
        this.reloadAcc = 0;
      }

      for (let i = 0; i < this.list.length; i++) {
        const b = this.list[i];
        b.x += b.v * dt;
        if (b.x - b.w / 2 > canvas.width) b.alive = false;
      }
      this.list = this.list.filter(b => b.alive);
    },

    render(ctx) {
      ctx.fillStyle = '#7cf8ff';
      for (let i = 0; i < this.list.length; i++) {
        const b = this.list[i];
        ctx.fillRect(b.x - b.w / 2, b.y - b.h / 2, b.w, b.h);
      }
    },
  };

  return state;
}
