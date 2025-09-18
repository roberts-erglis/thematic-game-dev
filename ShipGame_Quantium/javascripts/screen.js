import { BASE } from "./config.js";

export class Screen {
  constructor(container) {
    this.canvas = document.createElement("canvas");
    this.canvas.className = "game-canvas";
    this.ctx = this.canvas.getContext("2d");
    this.resize(BASE.WIDTH, BASE.HEIGHT * 2);

    const wrap = document.createElement("div");
    wrap.className = "screen-wrap";
    wrap.style.position = "relative";
    wrap.appendChild(this.canvas);

    this.hud = document.createElement("div");
    this.hud.className = "hud";
    wrap.appendChild(this.hud);

    this.toast = document.createElement("div");
    this.toast.className = "toast";
    this.toast.style.display = "none";
    wrap.appendChild(this.toast);

    this.deathWrap = document.createElement("div");
    this.deathWrap.className = "death-wrap";
    const card = document.createElement("div");
    card.className = "death-card";
    card.innerHTML = `
      <h2 id="death-title">Ship Destroyed</h2>
      <p id="death-reason">You collided with an enemy.</p>
      <p class="hint">Press <b>R</b> to restart (or <b>Enter</b>/<b>Space</b>).</p>
    `;
    this.deathTitle = card.querySelector("#death-title");
    this.deathReason = card.querySelector("#death-reason");
    this.deathWrap.appendChild(card);
    wrap.appendChild(this.deathWrap);

    container.appendChild(wrap);
  }

  resize(w, h) { this.canvas.width = w; this.canvas.height = h; }

  clear(bg) {
    const { ctx, canvas } = this;
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  drawMidLine(color) {
    const { ctx, canvas } = this;
    const y = canvas.height / 2;
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }

  writeHUD(text) { this.hud.textContent = text; }

  showToast(text, ms = 2000) {
    this.toast.textContent = text;
    this.toast.style.display = "block";
    clearTimeout(this._toastTimer);
    this._toastTimer = setTimeout(() => {
      this.toast.style.display = "none";
    }, ms);
  }

  showDeath(title, reason) {
    this.deathTitle.textContent = title || "Ship Destroyed";
    this.deathReason.textContent = reason || "";
    this.deathWrap.style.display = "flex";
  }

  hideDeath() { this.deathWrap.style.display = "none"; }
}
