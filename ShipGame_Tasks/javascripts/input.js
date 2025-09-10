const pressed = new Set();
const shoot = new Set();

const MOVE_KEYS = new Set([
  'arrowup','arrowdown','arrowleft','arrowright','w','a','s','d'
]);

function keyName(e) {
  if (e.code === 'Space') return 'space';
  const k = e.key.toLowerCase();
  if (k === ' ') return 'space';
  return k;
}

function onKeyDown(e) {
  const k = keyName(e);
  if (MOVE_KEYS.has(k) || k === 'space') {
    if (!pressed.has(k)) shoot.add(k);
    pressed.add(k);
    e.preventDefault();
  }
}
function onKeyUp(e) {
  const k = keyName(e);
  if (MOVE_KEYS.has(k) || k === 'space') {
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

  if (x || y) {
    const len = Math.hypot(x, y);
    x /= len; y /= len;
  }
  return { x, y };
}

export function consumePress(key) {
  const k = key.toLowerCase();
  if (shoot.has(k)) {
    shoot.delete(k);
    return true;
  }
  return false;
}
