// Screen's config
export const MAX_WIDTH_PX = 1440;
export const ASPECT = 16 / 9;
export const MAX_HEIGHT_RATIO = 0.70;

export const FIXED_HZ = 60;
export const FIXED_DT = 1 / FIXED_HZ;
export const MAX_STEPS_PER_FRAME = 5;

// HUD
export const HUD_MARGIN = 12;
export const SCORE_PER_STEP = 1;

// Spaceship's config
export const SHIP_SIZE_RATIO = 0.1;

// Enemy's config
export const ENEMY_SIZE_RATIO = 0.08;
export const ENEMY_MAX_ON_SCREEN = 15;
export const ENEMY_BASE_SPEED_RATIO = 0.35;
export const ENEMY_SPAWN_GAP_MIN = 0.25;
export const ENEMY_SPAWN_GAP_MAX = 0.60;
export const ENEMY_BASE_START = 1.0;
export const ENEMY_BASE_INC = 0.2;
export const ENEMY_BASE_EVERY_SEC = 15.0;
export const ENEMY_VARIANCE_RANGE = 0.5;

// Guided enemies
export const SEEKER_PROB = 0.15;
export const SEEKER_VERTICAL_SPEED_RATIO = 0.50;

// Bullets (extra: capped magazine + auto-refill)
export const BULLET_SIZE_RATIO = 0.03;
export const BULLET_SPEED_RATIO = 0.80;
export const BULLET_COOLDOWN_SEC = 0.15;
export const BULLET_MAGAZINE_SIZE = 6;
export const BULLET_RELOAD_INTERVAL_SEC = 0.50;

// Freeze (F)
export const FREEZE_DURATION_SEC = 1.5; // between 1–2 seconds as requested

// Teleport (R)
export const TELEPORT_MAX_TRIES = 40;

// Levels
export const LEVEL_SCORE_STEP = 600;
