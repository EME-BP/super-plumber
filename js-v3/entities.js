import {
  GRAVITY,
  MAX_FALL,
  RUN_SPEED,
  RUN_ACCEL,
  RUN_FRICTION,
  JUMP_VELOCITY,
  AIR_JUMP_VELOCITY,
  MAX_AIR_JUMPS,
  COYOTE_MS,
  FACING_VX_THRESHOLD,
  LEG_ANIM_VX,
  LEG_ANIM_VX_OFF,
} from "/js-v3/constants.js";
import { resolvePlatforms, aabbOverlap } from "/js-v3/physics.js";

export function createPlayer(spawn) {
  return {
    x: spawn.x,
    y: spawn.y,
    w: 28,
    h: 40,
    vx: 0,
    vy: 0,
    grounded: false,
    coyoteTimer: 0,
    airJumpsLeft: MAX_AIR_JUMPS,
    facing: 1,
    jumpHeld: false,
    runAnim: false,
  };
}

/**
 * @param {ReturnType<typeof createPlayer>} player
 * @param {import("./input.js").createInput extends (...args: infer _) => infer R ? R : never} input
 */
export function updatePlayer(player, input, dt, platforms, jumpEdge) {
  const left = input.left();
  const right = input.right();

  let targetVx = 0;
  if (left && !right) targetVx = -RUN_SPEED;
  else if (right && !left) targetVx = RUN_SPEED;

  const dv = targetVx - player.vx;
  const maxStep = RUN_ACCEL * dt;
  if (Math.abs(dv) <= maxStep) {
    player.vx = targetVx;
  } else {
    player.vx += Math.sign(dv) * maxStep;
  }

  if (targetVx === 0) {
    const friction = RUN_FRICTION * dt;
    if (player.vx > 0) player.vx = Math.max(0, player.vx - friction);
    else if (player.vx < 0) player.vx = Math.min(0, player.vx + friction);
  }

  player.vx = Math.max(-RUN_SPEED, Math.min(RUN_SPEED, player.vx));

  if (player.vx > FACING_VX_THRESHOLD) player.facing = 1;
  else if (player.vx < -FACING_VX_THRESHOLD) player.facing = -1;

  if (jumpEdge) {
    if (player.grounded || player.coyoteTimer > 0) {
      player.vy = JUMP_VELOCITY;
      player.grounded = false;
      player.coyoteTimer = 0;
      // #region agent log
      player._jumpKind = 'ground';
      player._apexY = player.y;
      fetch('http://127.0.0.1:7936/ingest/fc791c09-8db6-4f2a-8df3-297725951093',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'2fd595'},body:JSON.stringify({sessionId:'2fd595',runId:'jump-tune',location:'entities.js:groundJump',message:'ground jump start',data:{x:player.x,y:player.y,vy:player.vy,jumpVel:JUMP_VELOCITY},timestamp:Date.now(),hypothesisId:'H4'})}).catch(()=>{});
      // #endregion
    } else if (player.airJumpsLeft > 0) {
      player.vy = AIR_JUMP_VELOCITY;
      player.airJumpsLeft -= 1;
      // #region agent log
      player._jumpKind = 'air';
      fetch('http://127.0.0.1:7936/ingest/fc791c09-8db6-4f2a-8df3-297725951093',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'2fd595'},body:JSON.stringify({sessionId:'2fd595',runId:'jump-tune',location:'entities.js:airJump',message:'air jump start',data:{x:player.x,y:player.y,vy:player.vy},timestamp:Date.now(),hypothesisId:'H4'})}).catch(()=>{});
      // #endregion
    }
  }

  player.vy += GRAVITY * dt;
  if (player.vy > MAX_FALL) player.vy = MAX_FALL;

  const { grounded, hitCeiling } = resolvePlatforms(player, platforms, dt);
  player.grounded = grounded;
  // #region agent log
  if (!grounded && player.y < (player._apexY ?? 9999)) player._apexY = player.y;
  if (hitCeiling) {
    fetch('http://127.0.0.1:7936/ingest/fc791c09-8db6-4f2a-8df3-297725951093',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'2fd595'},body:JSON.stringify({sessionId:'2fd595',runId:'jump-tune',location:'entities.js:ceiling',message:'jump clipped by ceiling',data:{x:player.x,y:player.y,vy:player.vy},timestamp:Date.now(),hypothesisId:'H3'})}).catch(()=>{});
  }
  // #endregion

  if (grounded) {
    player.coyoteTimer = COYOTE_MS / 1000;
    player.airJumpsLeft = MAX_AIR_JUMPS;
  } else {
    player.coyoteTimer = Math.max(0, player.coyoteTimer - dt);
  }

  if (Math.abs(player.vx) >= LEG_ANIM_VX) player.runAnim = true;
  else if (Math.abs(player.vx) <= LEG_ANIM_VX_OFF) player.runAnim = false;

  if (hitCeiling && player.vy < 0) {
    player.vy = 0;
  }
}

export function createEnemy({ x, y, minX, maxX }) {
  return {
    x,
    y,
    w: 34,
    h: 34,
    vx: -70,
    minX,
    maxX,
    alive: true,
  };
}

export function updateEnemy(enemy, dt, platforms) {
  if (!enemy.alive) return;

  enemy.x += enemy.vx * dt;

  if (enemy.x <= enemy.minX) {
    enemy.x = enemy.minX;
    enemy.vx = Math.abs(enemy.vx);
  } else if (enemy.x + enemy.w >= enemy.maxX) {
    enemy.x = enemy.maxX - enemy.w;
    enemy.vx = -Math.abs(enemy.vx);
  }

  const feet = {
    x: enemy.x + 4,
    y: enemy.y + enemy.h - 2,
    w: enemy.w - 8,
    h: 4,
    vx: 0,
    vy: 0,
  };

  let onGround = false;
  for (const p of platforms) {
    if (aabbOverlap(feet, p) && feet.y + feet.h <= p.y + 8) {
      onGround = true;
      break;
    }
  }

  if (!onGround) {
    enemy.vx *= -1;
  }
}

export function createCoin(x, y) {
  return { x, y, r: 14, collected: false, spin: Math.random() * Math.PI * 2 };
}

export function updateCoin(coin, dt) {
  if (!coin.collected) coin.spin += dt * 6;
}
