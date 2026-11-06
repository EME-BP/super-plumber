import {
  START_LIVES,
  COIN_SCORE,
  STOMP_SCORE,
  INVULN_MS,
  RESPAWN_BLINK_MS,
} from "/js/constants.js";
import { createLevel } from "/js/level.js";
import {
  createPlayer,
  updatePlayer,
  createEnemy,
  updateEnemy,
  createCoin,
  updateCoin,
} from "/js/entities.js";
import { aabbOverlap } from "/js/physics.js";
import { computeCamera, drawWorld, drawCoin, drawEnemy, drawPlayer } from "/js/render.js";

export const STATE = {
  PLAYING: "playing",
  WON: "won",
  GAME_OVER: "game_over",
};

export function createGame() {
  const level = createLevel();
  return {
    state: STATE.PLAYING,
    level,
    player: createPlayer(level.spawn),
    enemies: level.enemies.map(createEnemy),
    coins: level.coins.map((c) => createCoin(c.x, c.y)),
    lives: START_LIVES,
    score: 0,
    cameraX: 0,
    invulnMs: 0,
    blinkTimer: 0,
    jumpWasDown: false,
    time: 0,
  };
}

export function resetGame(game) {
  const fresh = createGame();
  Object.assign(game, fresh);
}

function respawnPlayer(game) {
  const { spawn } = game.level;
  game.player.x = spawn.x;
  game.player.y = spawn.y;
  game.player.vx = 0;
  game.player.vy = 0;
  game.invulnMs = INVULN_MS;
}

function loseLife(game) {
  game.lives -= 1;
  if (game.lives <= 0) {
    game.state = STATE.GAME_OVER;
    return;
  }
  respawnPlayer(game);
}

function handleEnemyCollisions(game) {
  const { player } = game;
  if (game.invulnMs > 0) return;

  for (const enemy of game.enemies) {
    if (!enemy.alive) continue;
    if (!aabbOverlap(player, enemy)) continue;

    const playerFeet = player.y + player.h;
    const stomp =
      player.vy > 0 && playerFeet - enemy.y < 18 && player.x + player.w > enemy.x + 6;

    if (stomp) {
      enemy.alive = false;
      player.vy = -380;
      game.score += STOMP_SCORE;
    } else {
      loseLife(game);
      return;
    }
  }
}

function handleCoins(game) {
  for (const coin of game.coins) {
    if (coin.collected) continue;
    const box = { x: coin.x - coin.r, y: coin.y - coin.r, w: coin.r * 2, h: coin.r * 2 };
    if (aabbOverlap(game.player, box)) {
      coin.collected = true;
      game.score += COIN_SCORE;
    }
  }
}

function handleFlag(game) {
  const flag = game.level.flag;
  const hitBox = { x: flag.x, y: flag.y, w: flag.w + 30, h: flag.h };
  if (aabbOverlap(game.player, hitBox)) {
    game.state = STATE.WON;
  }
}

export function updateGame(game, input, dt) {
  game.time += dt;

  if (game.state !== STATE.PLAYING) {
    if (input.restart()) resetGame(game);
    return;
  }

  if (input.restart()) {
    resetGame(game);
    return;
  }

  const jumpDown = input.jumpPressed();
  const jumpEdge = jumpDown && !game.jumpWasDown;
  game.jumpWasDown = jumpDown;

  updatePlayer(game.player, input, dt, game.level.platforms, jumpEdge);

  if (game.player.x < 0) {
    game.player.x = 0;
    game.player.vx = 0;
  }

  const killY = game.level.killY;
  if (game.player.y > killY) {
    loseLife(game);
    return;
  }

  for (const enemy of game.enemies) {
    updateEnemy(enemy, dt, game.level.platforms);
  }
  for (const coin of game.coins) {
    updateCoin(coin, dt);
  }

  handleEnemyCollisions(game);
  if (game.state !== STATE.PLAYING) return;

  handleCoins(game);
  handleFlag(game);

  if (game.invulnMs > 0) {
    game.invulnMs -= dt * 1000;
    game.blinkTimer += dt * 1000;
  }

  game.cameraX = computeCamera(game.player.x, game.level.worldWidth);
}

export function drawGame(ctx, game) {
  drawWorld(ctx, game.level, game.cameraX, game.time);

  for (const coin of game.coins) {
    drawCoin(ctx, coin, game.cameraX);
  }
  for (const enemy of game.enemies) {
    drawEnemy(ctx, enemy, game.cameraX);
  }

  const blinkVisible =
    game.invulnMs <= 0 ||
    Math.floor(game.blinkTimer / RESPAWN_BLINK_MS) % 2 === 0;
  // #region agent log
  if (!drawGame._dbgN) drawGame._dbgN = 0;
  if (++drawGame._dbgN % 30 === 0) {
    fetch('http://127.0.0.1:7936/ingest/fc791c09-8db6-4f2a-8df3-297725951093',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'2fd595'},body:JSON.stringify({sessionId:'2fd595',location:'game.js:drawGame',message:'draw sample',data:{blinkVisible,invulnMs:game.invulnMs,vx:game.player.vx},timestamp:Date.now(),hypothesisId:'H4'})}).catch(()=>{});
  }
  // #endregion
  drawPlayer(ctx, game.player, game.cameraX, blinkVisible, game.time);
}

export function updateHud(game, livesEl, scoreEl) {
  livesEl.textContent = `Lives: ${Math.max(0, game.lives)}`;
  scoreEl.textContent = `Score: ${game.score}`;
}

export function updateOverlay(game, overlay, titleEl) {
  if (game.state === STATE.WON) {
    overlay.classList.remove("hidden");
    titleEl.textContent = `Level complete! Score: ${game.score}`;
  } else if (game.state === STATE.GAME_OVER) {
    overlay.classList.remove("hidden");
    titleEl.textContent = "Game over";
  } else {
    overlay.classList.add("hidden");
  }
}
