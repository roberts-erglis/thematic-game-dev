// Screen's config
export const MAX_WIDTH_PX = 1440;
export const ASPECT = 16 / 9;
export const MAX_HEIGHT_RATIO = 0.70;

export const FIXED_HZ = 60;
export const FIXED_DT = 1 / FIXED_HZ;
export const MAX_STEPS_PER_FRAME = 5;

export const SCORE_MODE = 'perFrame';
export const SCORE_PER_FRAME = 1;
export const SCORE_PER_SECOND = 60;

// Spaceship's config
export const SHIP_SIZE_RATIO = 0.1;

export const BULLET_SIZE_RATIO = 0.05;
export const BULLET_ASPECT = 3.0;
export const BULLET_SPEED_RATIO = 1.2;
export const BULLET_COOLDOWN = 0.1;

// Enemy's config
export const ENEMY_SIZE_RATIO = 0.08;
export const ENEMY_MAX_ON_SCREEN = 15;
export const ENEMY_BASE_SPEED_RATIO = 0.35;
export const ENEMY_SPAWN_GAP_MIN = 0.25;
export const ENEMY_SPAWN_GAP_MAX = 0.60;
export const ENEMY_BASE_START = 1.0;
export const ENEMY_BASE_INC = 0.2;
export const ENEMY_BASE_EVERY_SEC = 2.0;
export const ENEMY_VARIANCE_RANGE = 0.5;