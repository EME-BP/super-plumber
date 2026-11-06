import { TILE, WORLD_WIDTH } from "/js-v3/constants.js";

/** @typedef {{ x: number, y: number, w: number, h: number, kind?: string }} Rect */

const GROUND_Y = 460;
const GROUND_H = 80;

function block(x, y, w, h, kind = "brick") {
  return { x, y, w, h, kind };
}

function rock(x, y, w, h) {
  return { x, y, w, h, kind: "rock" };
}

function grave(x, y, w, h) {
  return { x, y, w, h, kind: "grave" };
}

function flagAtEnd() {
  return {
    x: WORLD_WIDTH - 120,
    y: GROUND_Y - 200,
    w: 40,
    h: 200,
  };
}

function createLevel1() {
  const platforms = [
    block(0, GROUND_Y, 520, GROUND_H, "ground"),
    block(640, GROUND_Y, 360, GROUND_H, "ground"),
    block(1120, GROUND_Y, 400, GROUND_H, "ground"),
    block(1680, GROUND_Y, 520, GROUND_H, "ground"),
    block(2320, GROUND_Y, 880, GROUND_H, "ground"),

    block(280, 380, 120, TILE, "brick"),
    block(400, 340, TILE, TILE, "brick"),
    block(440, 340, TILE, TILE, "brick"),
    block(480, 340, TILE, TILE, "brick"),

    block(720, 300, 160, TILE, "brick"),
    block(880, 260, TILE, TILE, "brick"),
    block(920, 260, TILE, TILE, "brick"),

    block(1200, 360, 200, TILE, "brick"),
    block(1280, 280, TILE, TILE, "question"),
    block(1320, 280, TILE, TILE, "question"),

    block(1520, 320, 120, TILE, "brick"),

    rock(1780, GROUND_Y - 100, 90, 100),
    rock(1900, GROUND_Y - 130, 100, 130),

    block(2100, 300, 240, TILE, "brick"),
    block(2180, 220, TILE, TILE, "brick"),
    block(2220, 220, TILE, TILE, "brick"),
    block(2260, 220, TILE, TILE, "brick"),

    block(2520, 360, 160, TILE, "brick"),
    block(2680, 300, TILE, TILE, "brick"),
    block(2720, 300, TILE, TILE, "brick"),
    block(2760, 300, TILE, TILE, "brick"),
  ];

  const coins = [
    { x: 320, y: 330 },
    { x: 360, y: 330 },
    { x: 760, y: 250 },
    { x: 800, y: 250 },
    { x: 1240, y: 310 },
    { x: 1560, y: 270 },
    { x: 2140, y: 250 },
    { x: 2300, y: 170 },
    { x: 2580, y: 310 },
    { x: 2740, y: 250 },
  ];

  const enemies = [
    { x: 780, y: GROUND_Y - 34, minX: 660, maxX: 980 },
    { x: 1300, y: GROUND_Y - 34, minX: 1140, maxX: 1500 },
    { x: 2400, y: GROUND_Y - 34, minX: 2340, maxX: 3180 },
  ];

  const clouds = [
    { x: 200, y: 80, w: 100, h: 40 },
    { x: 550, y: 120, w: 120, h: 44 },
    { x: 900, y: 60, w: 90, h: 36 },
    { x: 1400, y: 100, w: 110, h: 42 },
    { x: 1900, y: 70, w: 100, h: 38 },
    { x: 2500, y: 90, w: 130, h: 45 },
    { x: 2900, y: 110, w: 100, h: 40 },
  ];

  const trees = [
    { x: 120, y: GROUND_Y, scale: 1.1 },
    { x: 350, y: GROUND_Y, scale: 0.9 },
    { x: 580, y: GROUND_Y, scale: 1.2 },
    { x: 950, y: GROUND_Y, scale: 1 },
    { x: 1250, y: GROUND_Y, scale: 1.15 },
    { x: 1580, y: GROUND_Y, scale: 0.85 },
    { x: 2050, y: GROUND_Y, scale: 1.05 },
    { x: 2450, y: GROUND_Y, scale: 1.2 },
    { x: 2850, y: GROUND_Y, scale: 1 },
    { x: 3100, y: GROUND_Y, scale: 1.1 },
  ];

  return {
    id: 1,
    theme: "mountain",
    platforms,
    coins,
    enemies,
    flag: flagAtEnd(),
    clouds,
    trees,
    spawn: { x: 80, y: GROUND_Y - 40 },
    killY: GROUND_Y + GROUND_H + 120,
    worldWidth: WORLD_WIDTH,
  };
}

function createLevel2() {
  const platforms = [
    block(0, GROUND_Y, 494, GROUND_H, "ground"),
    block(640, GROUND_Y, 360, GROUND_H, "ground"),
    block(1120, GROUND_Y, 400, GROUND_H, "ground"),
    block(1680, GROUND_Y, 500, GROUND_H, "ground"),
    block(2320, GROUND_Y, 400, GROUND_H, "ground"),
    block(2820, GROUND_Y, 380, GROUND_H, "ground"),

    block(280, 380, 120, TILE, "brick"),
    block(400, 340, TILE, TILE, "brick"),
    block(440, 340, TILE, TILE, "brick"),
    block(480, 340, TILE, TILE, "brick"),

    block(720, 300, 160, TILE, "brick"),
    block(880, 260, TILE, TILE, "brick"),
    block(920, 260, TILE, TILE, "brick"),

    block(1200, 360, 200, TILE, "brick"),
    block(1280, 280, TILE, TILE, "question"),
    block(1320, 280, TILE, TILE, "question"),

    block(1520, 320, 120, TILE, "brick"),
    block(1600, 240, TILE, TILE, "brick"),

    grave(1780, GROUND_Y - 90, 70, 90),
    grave(1900, GROUND_Y - 120, 80, 120),

    block(2100, 300, 240, TILE, "brick"),
    block(2180, 220, TILE, TILE, "brick"),
    block(2220, 220, TILE, TILE, "brick"),
    block(2260, 220, TILE, TILE, "brick"),

    block(2480, 360, 140, TILE, "brick"),
    block(2680, 300, TILE, TILE, "brick"),
    block(2720, 300, TILE, TILE, "brick"),
    block(2760, 300, TILE, TILE, "brick"),
  ];

  const coins = [
    { x: 320, y: 330 },
    { x: 360, y: 330 },
    { x: 760, y: 250 },
    { x: 800, y: 250 },
    { x: 1240, y: 310 },
    { x: 1560, y: 270 },
    { x: 1620, y: 190 },
    { x: 2140, y: 250 },
    { x: 2300, y: 170 },
    { x: 2540, y: 310 },
    { x: 2740, y: 250 },
  ];

  const enemies = [
    { x: 780, y: GROUND_Y - 34, minX: 660, maxX: 980 },
    { x: 1260, y: 360 - 34, minX: 1208, maxX: 1392 },
    { x: 2400, y: GROUND_Y - 34, minX: 2340, maxX: 2700 },
  ];

  const clouds = [
    { x: 180, y: 90, w: 28, h: 22 },
    { x: 520, y: 70, w: 24, h: 20 },
    { x: 980, y: 110, w: 26, h: 20 },
    { x: 1460, y: 80, w: 30, h: 22 },
    { x: 1980, y: 60, w: 24, h: 18 },
    { x: 2460, y: 95, w: 28, h: 20 },
    { x: 2920, y: 75, w: 26, h: 20 },
  ];

  const trees = [
    { x: 110, y: GROUND_Y, scale: 1.1 },
    { x: 340, y: GROUND_Y, scale: 0.85 },
    { x: 900, y: GROUND_Y, scale: 1.05 },
    { x: 1240, y: GROUND_Y, scale: 0.9 },
    { x: 1720, y: GROUND_Y, scale: 1.15 },
    { x: 2060, y: GROUND_Y, scale: 0.95 },
    { x: 2500, y: GROUND_Y, scale: 1.1 },
    { x: 3000, y: GROUND_Y, scale: 1 },
  ];

  return {
    id: 2,
    theme: "haunted",
    platforms,
    coins,
    enemies,
    flag: flagAtEnd(),
    clouds,
    trees,
    spawn: { x: 80, y: GROUND_Y - 40 },
    killY: GROUND_Y + GROUND_H + 120,
    worldWidth: WORLD_WIDTH,
  };
}

function cactus(x, y, w, h) {
  return { x, y, w, h, kind: "cactus" };
}

function createLevel3() {
  const platforms = [
    block(0, GROUND_Y, 470, GROUND_H, "ground"),
    block(620, GROUND_Y, 340, GROUND_H, "ground"),
    block(1100, GROUND_Y, 380, GROUND_H, "ground"),
    block(1620, GROUND_Y, 460, GROUND_H, "ground"),
    block(2200, GROUND_Y, 360, GROUND_H, "ground"),
    block(2680, GROUND_Y, 180, GROUND_H, "ground"),
    block(2960, GROUND_Y, 240, GROUND_H, "ground"),

    block(280, 380, 120, TILE, "brick"),
    block(400, 340, TILE, TILE, "brick"),
    block(440, 340, TILE, TILE, "brick"),
    block(480, 340, TILE, TILE, "brick"),

    block(720, 300, 160, TILE, "brick"),
    block(880, 260, TILE, TILE, "brick"),
    block(920, 260, TILE, TILE, "brick"),

    block(1180, 360, 200, TILE, "brick"),
    block(1280, 280, TILE, TILE, "question"),
    block(1320, 280, TILE, TILE, "question"),

    block(1520, 320, 120, TILE, "brick"),
    block(1600, 240, TILE, TILE, "brick"),
    block(1680, 200, TILE, TILE, "brick"),

    cactus(1780, GROUND_Y - 90, 40, 90),
    cactus(1920, GROUND_Y - 120, 44, 120),

    block(2100, 300, 220, TILE, "brick"),
    block(2180, 220, TILE, TILE, "brick"),
    block(2220, 220, TILE, TILE, "brick"),
    block(2260, 220, TILE, TILE, "brick"),

    block(2480, 360, 140, TILE, "brick"),
    block(2720, 300, TILE, TILE, "brick"),
    block(2760, 300, TILE, TILE, "brick"),
  ];

  const coins = [
    { x: 320, y: 330 },
    { x: 360, y: 330 },
    { x: 760, y: 250 },
    { x: 800, y: 250 },
    { x: 1240, y: 310 },
    { x: 1560, y: 270 },
    { x: 1620, y: 190 },
    { x: 1700, y: 150 },
    { x: 2140, y: 250 },
    { x: 2300, y: 170 },
    { x: 2540, y: 310 },
    { x: 2740, y: 250 },
  ];

  const enemies = [
    { x: 740, y: GROUND_Y - 34, minX: 640, maxX: 940 },
    { x: 1240, y: 360 - 34, minX: 1188, maxX: 1372 },
    { x: 1760, y: GROUND_Y - 34, minX: 1640, maxX: 2060 },
    { x: 2320, y: GROUND_Y - 34, minX: 2220, maxX: 2540 },
  ];

  const clouds = [
    { x: 220, y: 80, w: 90, h: 28 },
    { x: 700, y: 60, w: 80, h: 24 },
    { x: 1280, y: 90, w: 100, h: 26 },
    { x: 1900, y: 70, w: 86, h: 24 },
    { x: 2500, y: 100, w: 94, h: 28 },
  ];

  const trees = [
    { x: 100, y: GROUND_Y, scale: 1 },
    { x: 360, y: GROUND_Y, scale: 0.85 },
    { x: 900, y: GROUND_Y, scale: 1.1 },
    { x: 1400, y: GROUND_Y, scale: 0.9 },
    { x: 2000, y: GROUND_Y, scale: 1.05 },
    { x: 2440, y: GROUND_Y, scale: 0.95 },
    { x: 3040, y: GROUND_Y, scale: 1 },
  ];

  return {
    id: 3,
    theme: "desert",
    platforms,
    coins,
    enemies,
    flag: flagAtEnd(),
    clouds,
    trees,
    spawn: { x: 80, y: GROUND_Y - 40 },
    killY: GROUND_Y + GROUND_H + 120,
    worldWidth: WORLD_WIDTH,
  };
}

function createLevel4() {
  const platforms = [
    block(0, 400, 260, 140, "roof"),
    block(380, 360, 220, 180, "roof"),
    block(720, 320, 200, 220, "roof"),
    block(1040, 380, 240, 160, "roof"),
    block(1420, 300, 220, 240, "roof"),
    block(1780, 340, 200, 200, "roof"),
    block(2140, 280, 220, 260, "roof"),
    block(2520, 360, 680, 180, "roof"),

    block(160, 320, TILE, TILE, "brick"),
    block(480, 280, TILE, TILE, "question"),
    block(820, 240, 80, TILE, "brick"),
    block(1120, 300, TILE, TILE, "brick"),
    block(1500, 220, TILE, TILE, "question"),
    block(1860, 260, 80, TILE, "brick"),
    block(2220, 200, TILE, TILE, "brick"),
    block(2260, 200, TILE, TILE, "brick"),
  ];

  const coins = [
    { x: 80, y: 350 },
    { x: 180, y: 270 },
    { x: 460, y: 230 },
    { x: 500, y: 230 },
    { x: 840, y: 190 },
    { x: 1140, y: 250 },
    { x: 1520, y: 170 },
    { x: 1640, y: 250 },
    { x: 1880, y: 210 },
    { x: 2240, y: 150 },
    { x: 2280, y: 150 },
    { x: 2600, y: 310 },
    { x: 2920, y: 310 },
  ];

  const enemies = [
    { x: 430, y: 360 - 34, minX: 390, maxX: 590 },
    { x: 1100, y: 380 - 34, minX: 1050, maxX: 1270 },
    { x: 1500, y: 300 - 34, minX: 1430, maxX: 1630 },
    { x: 2700, y: 360 - 34, minX: 2540, maxX: 3180 },
  ];

  const clouds = [
    { x: 160, y: 70, w: 18, h: 22 },
    { x: 520, y: 90, w: 16, h: 20 },
    { x: 980, y: 60, w: 18, h: 24 },
    { x: 1500, y: 80, w: 16, h: 20 },
    { x: 2100, y: 70, w: 18, h: 22 },
    { x: 2680, y: 95, w: 16, h: 20 },
  ];

  const trees = [
    { x: 40, y: 400, scale: 0.8 },
    { x: 900, y: 320, scale: 1 },
    { x: 1700, y: 340, scale: 0.9 },
    { x: 2400, y: 280, scale: 1.1 },
  ];

  return {
    id: 4,
    theme: "city",
    platforms,
    coins,
    enemies,
    flag: { x: WORLD_WIDTH - 140, y: 160, w: 40, h: 200 },
    clouds,
    trees,
    spawn: { x: 60, y: 360 },
    killY: GROUND_Y + GROUND_H + 120,
    worldWidth: WORLD_WIDTH,
  };
}

/**
 * @param {number} [id]
 */
export function createLevel(id = 1) {
  const n = Number(id);
  if (n === 2) return createLevel2();
  if (n === 3) return createLevel3();
  if (n === 4) return createLevel4();
  return createLevel1();
}
