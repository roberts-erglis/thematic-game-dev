const pressed = new Set();
const downOnce = new Set();

function normalizeKey(k) {
  k = k.toLowerCase();
  if (k === ' ') return 'space';
  return k;
}

const relevant = new Set([
  'arrowup', 'arrowdown', 'arrowleft', 'arrowright',
  'w', 'a', 's', 'd',
  'space', 'f', 'r',
]);

function onKeyDown(e) {
  const k = normalizeKey(e.key);
  if (relevant.has(k)) {
    if (!e.repeat) downOnce.add(k);
    pressed.add(k);
    e.preventDefault();
  }
}
function onKeyUp(e) {
  const k = normalizeKey(e.key);
  if (relevant.has(k)) {
    pressed.delete(k);
    e.preventDefault();
  }
}

window.addEventListener('keydown', onKeyDown, { passive: false });
window.addEventListener('keyup', onKeyUp, { passive: false });

export function getMoveVector() {
  let x = 0, y = 0;
  if (pressed.has('arrowleft') || pressed.has('a')) x -= 1;
  if (pressed.has('arrowright') || pressed.has('d')) x += 1;
  if (pressed.has('arrowup') || pressed.has('w')) y -= 1;
  if (pressed.has('arrowdown') || pressed.has('s')) y += 1;

  if (x !== 0 || y !== 0) {
    const len = Math.hypot(x, y);
    x /= len; y /= len;
  }
  return { x, y };
}

export function consumePress(keyName) {
  const k = normalizeKey(keyName);
  if (downOnce.has(k)) { downOnce.delete(k); return true; }
  return false;
}

export function isDown(keyName) {
  return pressed.has(normalizeKey(keyName));
}
