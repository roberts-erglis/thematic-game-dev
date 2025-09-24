import {
  FIXED_DT, MAX_STEPS_PER_FRAME, FIXED_HZ,
  ENEMY_BASE_START, ENEMY_BASE_INC, ENEMY_BASE_EVERY_SEC,
  HUD_MARGIN, SCORE_PER_STEP,
  FREEZE_DURATION_SEC, TELEPORT_MAX_TRIES,
  LEVEL_SCORE_STEP, BULLET_MAGAZINE_SIZE,
} from './config.js';
import { mountScreen } from './screen.js';
import { createSpaceship } from './spaceship.js';
import { createEnemies } from './enemies.js';
import { createBullets } from './bullets.js';
import { consumePress } from './input.js';

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

function teleportShipSomewhereSafe(ship, enemies, canvas) {
  const halfW = ship.w / 2;
  const halfH = ship.h / 2;
  const minX = halfW + 2;
  const maxX = canvas.width - halfW - 2;
  const minY = halfH + 2;
  const maxY = canvas.height - halfH - 2;

  for (let tries = 0; tries < TELEPORT_MAX_TRIES; tries++) {
    const x = Math.floor(minX + Math.random() * (maxX - minX));
    const y = Math.floor(minY + Math.random() * (maxY - minY));
    const probe = { x, y, w: ship.w, h: ship.h };

    let overlaps = false;
    for (let i = 0; i < enemies.list.length; i++) {
      if (collisionOverlap(probe, enemies.list[i])) { overlaps = true; break; }
    }
    if (!overlaps) { ship.x = x; ship.y = y; return true; }
  }
  return false;
}

export function startGame(root) {
  const { canvas, ctx } = mountScreen(root);
  const ship = createSpaceship(canvas);
  const speed = createSpeedController();
  const enemies = createEnemies(canvas);
  const bullets = createBullets(canvas);

  let last = performance.now();
  let acc = 0;
  let lastRender = 0;
  let gameOver = false;

  let score = 0;
  let freezeLeft = 0;

  function update(dt) {
    if (gameOver) return;

    const level = 1 + Math.floor(score / LEVEL_SCORE_STEP);

    speed.update(dt);
    const baseEnemySpeed = speed.value() * (1 + 0.10 * (level - 1));

    if (consumePress('space')) {
      bullets.fireFrom(ship);
    }
    if (consumePress('f') && freezeLeft <= 0) {
      freezeLeft = FREEZE_DURATION_SEC;
    }
    if (consumePress('r')) {
      teleportShipSomewhereSafe(ship, enemies, canvas);
    }

    if (freezeLeft > 0) freezeLeft = Math.max(0, freezeLeft - dt);

    ship.update(dt, canvas);
    bullets.update(dt, canvas);

    enemies.update(freezeLeft > 0 ? 0 : dt, baseEnemySpeed, ship, freezeLeft > 0);

    for (let i = 0; i < bullets.list.length; i++) {
      const b = bullets.list[i];
      for (let j = 0; j < enemies.list.length; j++) {
        const e = enemies.list[j];
        if (collisionOverlap(b, e)) {
          b.alive = false;
          e.alive = false;
          score += 25;
          break;
        }
      }
    }

    for (let i = 0; i < enemies.list.length; i++) {
      if (collisionOverlap(ship, enemies.list[i])) {
        gameOver = true;
        break;
      }
    }

    score += SCORE_PER_STEP;
  }

  function render() {
    ctx.fillStyle = '#141414';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    enemies.render(ctx);
    bullets.render(ctx);
    ship.render(ctx);

    // HUD
    ctx.font = '14px system-ui, sans-serif';
    ctx.fillStyle = '#9a9a9a';
    const margin = HUD_MARGIN;

    ctx.fillText(`Score: ${score}`, margin, 18);

    const level = 1 + Math.floor(score / LEVEL_SCORE_STEP);
    const hudRight = [
      `Lvl ${level}`,
      `Enemy speed: ${speed.value().toFixed(2)}`,
      `Ammo: ${bullets.magazine}/${BULLET_MAGAZINE_SIZE}`,
      freezeLeft > 0 ? `Frozen: ${freezeLeft.toFixed(1)}s` : 'F ready',
    ].join('   |   ');

    const m = ctx.measureText(hudRight);
    ctx.fillText(hudRight, canvas.width - margin - m.width, 18);

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
      const sub = `Final score: ${score}`;
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
