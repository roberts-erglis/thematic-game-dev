import { ENEMY_MAX_ON_SCREEN, ENEMY_SPAWN_GAP_MIN, ENEMY_SPAWN_GAP_MAX } from './config.js';
import { createEnemy } from './enemy.js';

function randRange(a, b) { return a + Math.random() * (b - a); }

export function createEnemies(canvas) {
  const state = {
    list: [],
    nextSpawnIn: 0.05,

    update(dt, baseSpeed) {
      this.nextSpawnIn -= dt;
      while (this.nextSpawnIn <= 0 && this.list.length < ENEMY_MAX_ON_SCREEN) {
        this.list.push(createEnemy(canvas, baseSpeed));
        this.nextSpawnIn += randRange(ENEMY_SPAWN_GAP_MIN, ENEMY_SPAWN_GAP_MAX);
      }

      for (let i = 0; i < this.list.length; i++) {
        this.list[i].update(dt, canvas, baseSpeed);
      }
      this.list = this.list.filter(e => e.alive);
    },

    render(ctx) {
      for (let i = 0; i < this.list.length; i++) {
        this.list[i].render(ctx);
      }
    }
  };

  return state;
}
