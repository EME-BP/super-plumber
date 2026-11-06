import { TILE, WORLD_WIDTH } from "/js/constants.js";

/** @typedef {{ x: number, y: number, w: number, h: number, kind?: string }} Rect */

const GROUND_Y = 460;
const GROUND_H = 80;

function block(x, y, w, h, kind = "brick") {
  return { x, y, w, h, kind };
}

function pipe(x, y, w, h) {
  return { x, y, w, h, kind: "pipe" };
}

/**
 * @returns {{ platforms: Rect[], coins: { x: number, y: number }[], enemies: { x: number, y: number, minX: number, maxX: number }[], flag: Rect, clouds: { x: number, y: number, w: number, h: number }[], spawn: { x: number, y: number }, killY: number }}
 */
export function createLevel() {
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

    pipe(1780, GROUND_Y - 120, 80, 120),
    pipe(1900, GROUND_Y - 160, 80, 160),

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

  const flag = {
    x: WORLD_WIDTH - 120,
    y: GROUND_Y - 200,
    w: 40,
    h: 200,
  };

  const clouds = [
    { x: 200, y: 80, w: 100, h: 40 },
    { x: 550, y: 120, w: 120, h: 44 },
    { x: 900, y: 60, w: 90, h: 36 },
    { x: 1400, y: 100, w: 110, h: 42 },
    { x: 1900, y: 70, w: 100, h: 38 },
    { x: 2500, y: 90, w: 130, h: 45 },
    { x: 2900, y: 110, w: 100, h: 40 },
  ];

  return {
    platforms,
    coins,
    enemies,
    flag,
    clouds,
    spawn: { x: 80, y: GROUND_Y - 48 },
    killY: GROUND_Y + GROUND_H + 120,
    worldWidth: WORLD_WIDTH,
  };
}
