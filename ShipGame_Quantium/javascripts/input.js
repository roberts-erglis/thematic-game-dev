export class Input {
  constructor() {
    this.keys = new Set();
    this.once = new Set();

    // --- Keyboard ---
    window.addEventListener("keydown", e => {
      const k = this._normalizeKey(e.key);
      this.keys.add(k);
      this.once.add(k);
    });

    window.addEventListener("keyup", e => {
      const k = this._normalizeKey(e.key);
      this.keys.delete(k);
    });

    document.addEventListener("pointerdown", e => {
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

    const endPointer = e => {
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

  // Map WASD to arrow keys; normalize everything to lowercase
  _normalizeKey(k) {
    k = (k || "").toLowerCase();
    if (k === "w") return "arrowup";
    if (k === "a") return "arrowleft";
    if (k === "s") return "arrowdown";
    if (k === "d") return "arrowright";
    // Space sometimes comes as ' ' in some browsers:
    if (k === " ") return " ";
    return k;
  }

  // consume a one-shot key (true once per press)
  hit(k) {
    k = k.toLowerCase();
    const had = this.once.has(k);
    if (had) this.once.delete(k);
    return had;
  }

  // is the key currently being held?
  down(k) {
    return this.keys.has(k.toLowerCase());
  }
}
