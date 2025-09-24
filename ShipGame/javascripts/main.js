// Visual Debug
// import { mountScreen } from "./screen.js";
// window.addEventListener("DOMContentLoaded", () => {
//   const root = document.getElementById("app");
//   const screen = mountScreen(root);

//   const { ctx, canvas } = screen;
//   ctx.fillStyle = "#9a9a9a";
//   ctx.font = "16px system-ui, sans-serif";
//   ctx.fillText(`Screen: ${canvas.width}×${canvas.height}`, 14, 24);
// });

import { startGame } from './game.js';
window.addEventListener('DOMContentLoaded', () => {
  const root = document.getElementById('app');
  startGame(root);
});