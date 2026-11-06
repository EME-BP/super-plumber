/**
 * Smoke tests for Super Plumber player movement.
 * Failures are warnings only: always exit 0 so the game is never blocked.
 */
import { createGame, startLevel, updateGame, coinsCollected, coinsTotal, STATE } from "/js-v3/game.js";
import { createCoin } from "/js-v3/entities.js";

if (typeof globalThis.localStorage === "undefined") {
  const mem = new Map();
  globalThis.localStorage = {
    getItem: (k) => (mem.has(k) ? mem.get(k) : null),
    setItem: (k, v) => mem.set(k, String(v)),
    removeItem: (k) => mem.delete(k),
  };
}

const dt = 1 / 60;

function inputOf({ left = false, right = false, jump = false, restart = false } = {}) {
  return {
    left: () => left,
    right: () => right,
    jumpPressed: () => jump,
    restart: () => restart,
  };
}

function step(game, opts = {}, frames = 1) {
  const input = inputOf(opts);
  for (let i = 0; i < frames; i++) updateGame(game, input, dt);
}

function freshLevel1() {
  const game = createGame();
  startLevel(game, 1, "Smoke");
  return game;
}

const results = [];

function check(name, ok, detail) {
  results.push({ name, ok: !!ok, detail: detail || "" });
}

{
  const game = freshLevel1();
  check(
    "1. entrar al nivel uno",
    game.state === STATE.PLAYING && game.levelId === 1 && game.player,
    `state=${game.state} levelId=${game.levelId}`
  );
}

{
  const game = freshLevel1();
  const startY = game.player.y;
  step(game, { jump: true }, 1);
  const afterFirst = { vy: game.player.vy, air: game.player.airJumpsLeft, grounded: game.player.grounded };
  step(game, {}, 1);
  step(game, { jump: true }, 1);
  const afterSecond = { vy: game.player.vy, air: game.player.airJumpsLeft };
  const ok =
    afterFirst.vy < 0 &&
    afterFirst.grounded === false &&
    afterSecond.vy < 0 &&
    afterSecond.air === 0 &&
    game.player.y < startY;
  check("2. hacer el doble salto", ok, `firstVy=${afterFirst.vy.toFixed(0)} secondAir=${afterSecond.air} y=${game.player.y.toFixed(1)}`);
}

{
  const game = freshLevel1();
  const x0 = game.player.x;
  step(game, { left: true }, 20);
  check("3. caminar hacia la izquierda", game.player.vx < 0 && game.player.x < x0, `vx=${game.player.vx.toFixed(1)} x=${game.player.x.toFixed(1)}`);
}

{
  const game = freshLevel1();
  const x0 = game.player.x;
  step(game, { right: true }, 20);
  check("4. caminar hacia la derecha", game.player.vx > 0 && game.player.x > x0, `vx=${game.player.vx.toFixed(1)} x=${game.player.x.toFixed(1)}`);
}

{
  const game = freshLevel1();
  const enemy = game.enemies.find((e) => e.alive);
  if (!enemy) {
    check("5. matar a un adversario", false, "no hay enemigo");
  } else {
    game.player.x = enemy.x + 4;
    game.player.y = enemy.y - game.player.h + 8;
    game.player.vy = 200;
    game.player.grounded = false;
    game.invulnMs = 0;
    step(game, {}, 1);
    check("5. matar a un adversario", enemy.alive === false, `alive=${enemy.alive}`);
  }
}

{
  const game = freshLevel1();
  const beforeCollected = coinsCollected(game);
  const beforeTotal = coinsTotal(game);
  const extra = createCoin(game.player.x + game.player.w / 2, game.player.y + game.player.h / 2);
  game.coins.push(extra);
  const afterAdd = coinsTotal(game);
  step(game, {}, 1);
  const afterCollect = coinsCollected(game);
  check(
    "6. agregar una moneda y verificar que el contador de monedas se actualice",
    afterAdd === beforeTotal + 1 && afterCollect === beforeCollected + 1 && extra.collected,
    `total ${beforeTotal}->${afterAdd} collected ${beforeCollected}->${afterCollect}`
  );
}

const failed = results.filter((r) => !r.ok);
for (const r of results) {
  const line = `${r.ok ? "PASS" : "WARN"}  ${r.name}${r.detail ? ` (${r.detail})` : ""}`;
  if (r.ok) console.log(line);
  else console.warn(line);
}

if (failed.length) {
  console.warn(`Aviso: ${failed.length}/${results.length} pruebas fallaron. El juego no se detiene.`);
} else {
  console.log(`OK: ${results.length}/${results.length} pruebas pasaron.`);
}

process.exit(0);
