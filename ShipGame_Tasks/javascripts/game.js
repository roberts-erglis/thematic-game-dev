import { FIXED_DT, MAX_STEPS_PER_FRAME, FIXED_HZ, ENEMY_BASE_START, ENEMY_BASE_INC, ENEMY_BASE_EVERY_SEC, BULLET_SIZE_RATIO, BULLET_ASPECT, BULLET_SPEED_RATIO, BULLET_COOLDOWN, SCORE_MODE, SCORE_PER_FRAME, SCORE_PER_SECOND } from './config.js';
import { mountScreen } from './screen.js';
import { createSpaceship } from './spaceship.js';
import { createEnemies } from './enemies.js';
import { consumePress } from './input.js';

export function createBullets(canvas) {
  const bullets = {
    list: [],

    _size() {
      const base = Math.min(canvas.width, canvas.height);
      const w = Math.max(2, Math.floor(base * BULLET_SIZE_RATIO));
      const h = Math.max(2, Math.floor(w / BULLET_ASPECT));
      return { w, h };
    },

    shoot(fromX, fromY, shipW) {
      const { w, h } = this._size();
      const x = fromX + (shipW / 2) + (w / 2) + 2;
      const y = fromY;

      const speed = BULLET_SPEED_RATIO * Math.min(canvas.width, canvas.height);

      this.list.push({
        x, y, w, h, alive: true,
        update(dt) {
          this.x += speed * dt;
          if (this.x - this.w / 2 > canvas.width) this.alive = false;
        },
        render(ctx) {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(this.x - this.w / 2, this.y - this.h / 2, this.w, this.h);
        }
      });
    },

    update(dt) {
      for (let i = 0; i < this.list.length; i++) {
        this.list[i].update(dt);
      }
      this.list = this.list.filter(b => b.alive);
    },

    render(ctx) {
      for (let i = 0; i < this.list.length; i++) {
        this.list[i].render(ctx);
      }
    }
  };

  return bullets;
}

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
  const bullets = createBullets(canvas);

  let last = performance.now();
  let acc = 0;
  let lastRender = 0;
  let gameOver = false;

  let score = 0;
  let scoreAcc = 0;

  let shootCooldown = 0;

  function addScore(dt) {
    if (SCORE_MODE === 'perFrame') {
      score += SCORE_PER_FRAME;
    } else {
      scoreAcc += SCORE_PER_SECOND * dt;
      const whole = Math.floor(scoreAcc);
      if (whole > 0) {
        score += whole;
        scoreAcc -= whole;
      }
    }
  }

  function update(dt) {
    if (gameOver) return;

    speed.update(dt);
    const baseEnemySpeed = speed.value();

    ship.update(dt, canvas);
    enemies.update(dt, baseEnemySpeed);
    bullets.update(dt);

    shootCooldown -= dt;
    if (consumePress('space') && shootCooldown <= 0) {
      bullets.shoot(ship.x, ship.y, ship.w);
      shootCooldown = BULLET_COOLDOWN;
    }

    for (let i = 0; i < bullets.list.length; i++) {
      const b = bullets.list[i];
      if (!b.alive) continue;
      for (let j = 0; j < enemies.list.length; j++) {
        const e = enemies.list[j];
        if (!e.alive) continue;
        if (collisionOverlap(b, e)) {
          b.alive = false;
          e.alive = false;
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

    addScore(dt);
  }

  function render(now) {
    ctx.fillStyle = '#141414';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    enemies.render(ctx);
    bullets.render(ctx);
    ship.render(ctx);

    ctx.font = '14px system-ui, sans-serif';
    ctx.fillStyle = '#9a9a9a';
    ctx.fillText(`Score: ${score}`, 12, 22);
    const speedLabel = `Enemy speed (base): ${speed.value().toFixed(2)}`;
    const m = ctx.measureText(speedLabel);
    ctx.fillText(speedLabel, canvas.width - 12 - m.width, 22);

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

      ctx.font = '14px system-ui, sans-serif';
      const sub = `Score: ${score}`;
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