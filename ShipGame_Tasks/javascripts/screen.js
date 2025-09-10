import { MAX_WIDTH_PX, ASPECT, MAX_HEIGHT_RATIO } from './config.js';

function computeScreenSize() {
  const vw = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
  const vh = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

  const maxWidth = Math.min(vw, MAX_WIDTH_PX);
  const maxHeight = Math.floor(vh * MAX_HEIGHT_RATIO);

  const width = Math.min(maxWidth, Math.floor(maxHeight * ASPECT));
  const height = Math.floor(width / ASPECT);

  return { width, height };
}

export function mountScreen(root) {
  const wrap = document.createElement('div');
  wrap.className = 'screen-wrap';

  const canvas = document.createElement('canvas');
  canvas.className = 'game-canvas';
  wrap.appendChild(canvas);
  root.appendChild(wrap);

  const applySize = () => {
    const { width, height } = computeScreenSize();
    canvas.width = width;
    canvas.height = height;

    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
  };

  applySize();

  let raf = 0;
  const onResize = () => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(applySize);
  };
  window.addEventListener('resize', onResize);

  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#1b1b1b';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  return { canvas, ctx, destroy: () => window.removeEventListener('resize', onResize) };
}
