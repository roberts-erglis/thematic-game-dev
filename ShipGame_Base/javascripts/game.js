// js/game.js
import { FIXED_DT, MAX_STEPS_PER_FRAME, FIXED_HZ, ENEMY_BASE_START, ENEMY_BASE_INC, ENEMY_BASE_EVERY_SEC } from './config.js';
import { mountScreen } from './screen.js';
import { createSpaceship } from './spaceship.js';
import { createEnemies } from './enemies.js';

export function createSpeedController() {
  let base = ENEMY_BASE_START;
  let acc = 0;

  return {
    update(dt) {
      acc += dt;
      while (acc >= ENEMY_BASE_EVERY_SEC) {
        base += ENEMY_BASE_INC;
        acc -= ENEMY_BASE_EVERY_SEC;
      }
    },
    value() {
      return base;
    }
  };
}

export function collisionOverlap(a, b) {
  const dx = Math.abs(a.x - b.x);
  const dy = Math.abs(a.y - b.y);
  return dx <= (a.w + b.w) * 0.5 && dy <= (a.h + b.h) * 0.5;
}

export function startGame(root) {
  const { canvas, ctx } = mountScreen(root);
  const ship = createSpaceship(canvas);
  const speed = createSpeedController();
  const enemies = createEnemies(canvas);

  let last = performance.now();
  let acc = 0;
  let lastRender = 0;
  let gameOver = false;

  function update(dt) {
    if (gameOver) return;
    speed.update(dt);
    const baseEnemySpeed = speed.value();

    ship.update(dt, canvas);
    enemies.update(dt, baseEnemySpeed);

    for (let i = 0; i < enemies.list.length; i++) {
      if (collisionOverlap(ship, enemies.list[i])) {
        gameOver = true;
        break;
      }
    }
  }

  function render() {
    ctx.fillStyle = '#141414';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    enemies.render(ctx);
    ship.render(ctx);

    ctx.font = '14px system-ui, sans-serif';
    ctx.fillStyle = '#9a9a9a';
    ctx.fillText(`Screen: ${canvas.width}×${canvas.height}`, 12, 22);

    const label = `Enemy speed: ${speed.value().toFixed(2)}`;
    const m = ctx.measureText(label);
    ctx.fillText(label, canvas.width - 12 - m.width, 22);

    if (gameOver) {
      ctx.save();
      ctx.globalAlpha = 0.72;
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.restore();

      const base = Math.min(canvas.width, canvas.height);
      const titleSize = Math.max(24, Math.floor(base * 0.08));
      ctx.font = `bold ${titleSize}px system-ui, sans-serif`;
      ctx.fillStyle = '#ffffff';
      const msg = 'GAME OVER';
      const w = ctx.measureText(msg).width;
      ctx.fillText(msg, (canvas.width - w) / 2, Math.floor(canvas.height * 0.45));

      ctx.font = `14px system-ui, sans-serif`;
      const sub = 'You snooze, you lose!';
      const sw = ctx.measureText(sub).width;
      ctx.fillStyle = '#bbbbbb';
      ctx.fillText(sub, (canvas.width - sw) / 2, Math.floor(canvas.height * 0.45) + 28);
    }
  }

  function frame(now) {
    const dt = (now - last) / 1000;
    last = now;
    acc += dt;

    let steps = 0;
    while (acc >= FIXED_DT && steps < MAX_STEPS_PER_FRAME) {
      update(FIXED_DT);
      acc -= FIXED_DT;
      steps++;
    }
    if (steps === MAX_STEPS_PER_FRAME) acc = 0;

    const renderIntervalMs = 1000 / FIXED_HZ;
    if (now - lastRender >= renderIntervalMs) {
      render(now);
      lastRender = now;
    }

    requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
}
