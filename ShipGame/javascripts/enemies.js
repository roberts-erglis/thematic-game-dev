import {
  ENEMY_MAX_ON_SCREEN,
  ENEMY_SPAWN_GAP_MIN,
  ENEMY_SPAWN_GAP_MAX,
  SEEKER_PROB,
} from "./config.js";
import { createEnemy } from "./enemy.js";

function randRange(a, b) {
  return a + Math.random() * (b - a);
}

export function createEnemies(canvas) {
  const state = {
    list: [],
    nextSpawnIn: 0.05,

    update(dt, baseSpeed, ship, frozen = false) {
      if (!frozen) {
        this.nextSpawnIn -= dt;
        while (this.nextSpawnIn <= 0 && this.list.length < ENEMY_MAX_ON_SCREEN) {
          const guided = Math.random() < SEEKER_PROB;
          this.list.push(createEnemy(canvas, guided));
          this.nextSpawnIn += randRange(ENEMY_SPAWN_GAP_MIN, ENEMY_SPAWN_GAP_MAX);
        }

        for (let i = 0; i < this.list.length; i++) {
          this.list[i].update(dt, canvas, baseSpeed, ship?.y);
        }
      }
      this.list = this.list.filter((e) => e.alive);
    },

    render(ctx) {
      for (let i = 0; i < this.list.length; i++) {
        this.list[i].render(ctx);
      }
    },
  };

  return state;
}
