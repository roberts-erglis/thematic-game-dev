const pressed = new Set();

const relevant = new Set([
  'arrowup', 'arrowdown', 'arrowleft', 'arrowright',
  'w', 'a', 's', 'd'
]);

function onKeyDown(e) {
  const k = e.key.toLowerCase();
  if (relevant.has(k)) {
    pressed.add(k);
    e.preventDefault();
  }
}
function onKeyUp(e) {
  const k = e.key.toLowerCase();
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
