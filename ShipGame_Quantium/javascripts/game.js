import { BASE, SHIP, ENEMY, STATES, RANDOM, SLOWMO } from "./config.js";
import { Screen } from "./screen.js";
import {
  Ship,
  keepInSameHalf,
  clampYToHalf,
  transferAcrossHalves,
} from "./spaceship.js";
import { Enemies } from "./enemies.js";

export class Game {
  constructor(container, input) {
    this.screen = new Screen(container);
    this.ctx = this.screen.ctx;
    this.input = input;

    this.initState();
    this._lastTime = performance.now();
  }

  initState() {
    this.state = STATES.ZERO;
    this.mode = "classic";
    this.gameOver = false;

    this.autoGates = true;
    this.slowEndAt = 0;

    const startX = 80;
    const startY = BASE.HEIGHT / 2;
    this.ship = new Ship(startX, startY);
    this.twin = null;

    this.enemies = new Enemies();

    this.screen.hideDeath();
  }

  applyX() {
    if (this.mode !== "classic" || this.gameOver) return false;
    if (this.state === STATES.ZERO || this.state === STATES.ONE) {
      const wasUpper = this.ship.y < BASE.HEIGHT ? 0 : 1;
      const y2 = transferAcrossHalves(this.ship.y);
      const targetHalf = 1 - wasUpper;
      this.ship.y = clampYToHalf(y2, targetHalf);
      this.state = this.state === STATES.ZERO ? STATES.ONE : STATES.ZERO;
      return true;
    }
    return false;
  }

  applyH() {
    if (this.gameOver) return false;
    if (this.mode === "classic") {
      if (this.state === STATES.ZERO || this.state === STATES.ONE) {
        this.state = this.state === STATES.ZERO ? STATES.PLUS : STATES.MINUS;
        this.mode = "quantum";
        const twinYraw = transferAcrossHalves(this.ship.y);
        const twinHalf = this.ship.y < BASE.HEIGHT ? 1 : 0;
        this.twin = new Ship(
          this.ship.x,
          clampYToHalf(twinYraw, twinHalf),
          "#ffb05f"
        );
        return true;
      }
      return false;
    } else {
      if (this.state === STATES.PLUS || this.state === STATES.MINUS) {
        this.state = this.state === STATES.PLUS ? STATES.ZERO : STATES.ONE;
        this.mode = "classic";
        const currentHalf = this.ship.y < BASE.HEIGHT ? 0 : 1;
        this.ship.y = clampYToHalf(this.ship.y, currentHalf);
        this.twin = null;
        return true;
      }
      return false;
    }
  }

  applyZ() {
    if (this.gameOver) return false;
    if (this.mode !== "quantum") return false;
    if (this.state === STATES.PLUS) {
      this.state = STATES.MINUS;
      return true;
    }
    if (this.state === STATES.MINUS) {
      this.state = STATES.PLUS;
      return true;
    }
    return false;
  }

  rectsOverlap(a, b) {
    return !(
      a.right < b.left ||
      a.left > b.right ||
      a.bottom < b.top ||
      a.top > b.bottom
    );
  }

  classicCollision() {
    for (const e of this.enemies.items) {
      if (this.rectsOverlap(e.rect, this.ship.rect)) return true;
    }
    return false;
  }

  anyCollisionWithShipsQuantum() {
    for (const e of this.enemies.items) {
      if (this.rectsOverlap(e.rect, this.ship.rect)) return true;
      if (this.twin && this.rectsOverlap(e.rect, this.twin.rect)) return true;
    }
    return false;
  }

  onDeath(title, reason) {
    this.gameOver = true;
    this.screen.showDeath(title, reason);
  }

  measureCollapse() {
    const r = 1 + Math.floor(Math.random() * 100);
    const observed = r % 2 === 0 ? STATES.ZERO : STATES.ONE;

    const wantUpper = observed === STATES.ZERO ? 0 : 1;
    const isUpper = this.ship.y < BASE.HEIGHT ? 0 : 1;
    let newY = this.ship.y;
    if (wantUpper !== isUpper) newY = transferAcrossHalves(this.ship.y);
    this.ship.y = clampYToHalf(newY, wantUpper);

    this.state = observed;
    this.mode = "classic";
    this.twin = null;

    let destroyed = false;
    for (const e of this.enemies.items) {
      if (this.rectsOverlap(e.rect, this.ship.rect)) {
        destroyed = true;
        break;
      }
    }

    if (destroyed) {
      this.onDeath(
        "Measurement Result: DESTROYED",
        `Observed ${observed}. Your ship was destroyed upon collapse.`
      );
    } else {
      this.screen.showToast(
        `Measurement → observed ${observed}. Ship SURVIVED.`,
        2200
      );
    }
  }

  toggleAutoGates() {
    this.autoGates = !this.autoGates;
    this.screen.showToast(`Auto-Gates: ${this.autoGates ? "ON" : "OFF"}`, 1200);
  }

  maybeApplyAutoGate(now) {
    if (!this.autoGates || this.gameOver) return;

    const r = Math.floor(Math.random() * (RANDOM.RANGE + 1));
    const beforeState = this.state;
    const beforeMode = this.mode;

    let changed = false;
    let applied = null;

    if (RANDOM.H_HITS.includes(r)) {
      changed = this.applyH();
      applied = "H";
    } else if (RANDOM.X_HITS.includes(r)) {
      changed = this.applyX();
      applied = "X";
    } else if (RANDOM.Z_HITS.includes(r)) {
      changed = this.applyZ();
      applied = "Z";
    }

    if (changed) {
      this.slowEndAt = Math.max(this.slowEndAt, now + SLOWMO.DURATION_MS);

      const afterState = this.state;
      const afterMode = this.mode;
      this.screen.showToast(
        `Auto ${applied}: ${beforeState} → ${afterState}`,
        1400
      );
    }
  }

  update(dt, now) {
    if (this.gameOver) {
      if (this.input.hit("r") || this.input.hit("enter") || this.input.hit(" "))
        this.initState();
      return;
    }

    if (this.input.hit("t")) this.toggleAutoGates();

    if (!this.autoGates) {
      if (this.input.hit("x")) this.applyX();
      if (this.input.hit("h")) this.applyH();
      if (this.input.hit("z")) this.applyZ();
    }

    this.maybeApplyAutoGate(now);

    const speedScale = now < this.slowEndAt ? SLOWMO.SPEED_SCALE : 1.0;
    const dtScaled = dt * speedScale;

    let enemyVerticalDelta = 0;
    if (this.mode === "classic") {
      let dx = 0,
        dy = 0;
      if (this.input.down("arrowleft")) dx -= SHIP.SPEED;
      if (this.input.down("arrowright")) dx += SHIP.SPEED;
      if (this.input.down("arrowup")) dy -= SHIP.SPEED;
      if (this.input.down("arrowdown")) dy += SHIP.SPEED;

      this.ship.x = Math.max(
        12,
        Math.min(BASE.WIDTH - 12, this.ship.x + (dx * dtScaled) / (1 / 60))
      ); // mild frame-normalization
      this.ship.y = keepInSameHalf(
        this.ship.y,
        this.ship.y + (dy * dtScaled) / (1 / 60)
      );
    } else {
      if (this.input.down("arrowup")) enemyVerticalDelta -= ENEMY.SPEED_Y_STEP;
      if (this.input.down("arrowdown"))
        enemyVerticalDelta += ENEMY.SPEED_Y_STEP;
      enemyVerticalDelta *= dtScaled / (1 / 60);
    }

    this.enemies.update(dtScaled, this.mode === "quantum", enemyVerticalDelta);

    if (this.mode === "classic" && this.classicCollision()) {
      this.onDeath("Crashed!", "You collided with an enemy.");
      return;
    }

    if (this.mode === "quantum" && this.anyCollisionWithShipsQuantum()) {
      this.measureCollapse();
    }
  }

  draw() {
    this.screen.clear(BASE.BG);
    this.screen.drawMidLine(BASE.LINE);
    this.enemies.draw(this.ctx);
    if (this.twin) this.twin.draw(this.ctx);
    this.ship.draw(this.ctx);

    const modeTxt = this.mode === "classic" ? "Classic" : "Quantum";
    const autoTxt = this.autoGates ? " • AutoGates ON" : "";
    this.screen.writeHUD(`${modeTxt}  •  state ${this.state}${autoTxt}`);
  }

  frame(now) {
    const dt = Math.min(0.05, (now - this._lastTime) / 1000);
    this._lastTime = now;
    this.update(dt, now);
    this.draw();
    requestAnimationFrame((t) => this.frame(t));
  }

  start() {
    this._lastTime = performance.now();
    requestAnimationFrame((t) => this.frame(t));
  }
}
