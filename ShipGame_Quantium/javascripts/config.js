export const BASE = {
  WIDTH: 800,
  HEIGHT: 320,
  BG: "#141414",
  LINE: "#3a3a3a",
};

export const SHIP = {
  W: 32,
  H: 18,
  SPEED: 3,
  COLOR: "#5fd1ff",
  TWIN_COLOR: "#ffb05f",
};

export const ENEMY = {
  W: 24,
  H: 16,
  SPEED_X: 120,
  SPEED_Y_STEP: 5,
  COLOR: "#ff5f7a",
  SPAWN_EVERY_MS: 400,
  MAX_COUNT: 16,
};

export const STATES = {
  ZERO: "|0>",
  ONE: "|1>",
  PLUS: "|+>",
  MINUS: "|->",
};

export const RANDOM = {
  RANGE: 500,
  X_HITS: [100, 200],
  Z_HITS: [50, 250],
  H_HITS: [200],
};

export const SLOWMO = {
  DURATION_MS: 1000,
  SPEED_SCALE: 0.5,
};
