export class Input {
  constructor() {
    this.keys = new Set();
    this.once = new Set();

    window.addEventListener("keydown", (e) => {
      const k = this._normalizeKey(e.key);
      this.keys.add(k);
      this.once.add(k);
    });

    window.addEventListener("keyup", (e) => {
      const k = this._normalizeKey(e.key);
      this.keys.delete(k);
    });

    document.addEventListener("pointerdown", (e) => {
      const btn = e.target.closest(".ctl-btn");
      if (!btn) return;
      e.preventDefault();
      const key = (btn.getAttribute("data-key") || "").toLowerCase();
      const hold = btn.hasAttribute("data-hold");
      btn.classList.add("active");
      if (hold) {
        this.keys.add(key);
      } else {
        this.once.add(key);
      }
    });

    const endPointer = (e) => {
      const btn = e.target.closest(".ctl-btn");
      if (!btn) return;
      const key = (btn.getAttribute("data-key") || "").toLowerCase();
      const hold = btn.hasAttribute("data-hold");
      btn.classList.remove("active");
      if (hold) {
        this.keys.delete(key);
      }
    };

    document.addEventListener("pointerup", endPointer);
    document.addEventListener("pointercancel", endPointer);
    document.addEventListener("pointerleave", endPointer);
  }

  _normalizeKey(k) {
    k = (k || "").toLowerCase();
    if (k === "w") return "arrowup";
    if (k === "a") return "arrowleft";
    if (k === "s") return "arrowdown";
    if (k === "d") return "arrowright";
    if (k === " ") return " ";
    return k;
  }

  hit(k) {
    k = k.toLowerCase();
    const had = this.once.has(k);
    if (had) this.once.delete(k);
    return had;
  }

  down(k) {
    return this.keys.has(k.toLowerCase());
  }
}
