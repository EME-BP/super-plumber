/** @typedef {{ x: number, y: number, w: number, h: number }} AABB */

export function aabbOverlap(a, b) {
  return (
    a.x < b.x + b.w &&
    a.x + a.w > b.x &&
    a.y < b.y + b.h &&
    a.y + a.h > b.y
  );
}

function hOverlap(body, p) {
  return body.x + body.w > p.x && body.x < p.x + p.w;
}

/**
 * @param {{ x: number, y: number, w: number, h: number, vx: number, vy: number }} body
 * @param {AABB[]} platforms
 * @returns {{ grounded: boolean, hitCeiling: boolean }}
 */
export function resolvePlatforms(body, platforms, dt) {
  const prevY = body.y;
  const prevFeet = prevY + body.h;

  body.y += body.vy * dt;

  let grounded = false;
  let hitCeiling = false;
  const feet = body.y + body.h;
  const head = body.y;

  if (body.vy > 0) {
    let bestSnap = null;
    for (const p of platforms) {
      if (!hOverlap(body, p)) continue;
      const top = p.y;
      const bottom = p.y + p.h;
      const crossedTop = prevFeet <= top + 1 && feet >= top - 1;
      const embedded =
        feet > top &&
        feet <= bottom &&
        body.y < bottom &&
        prevFeet <= bottom &&
        prevFeet > top;
      if (!crossedTop && !embedded) continue;
      const snapY = top - body.h;
      if (bestSnap === null || snapY < bestSnap) bestSnap = snapY;
    }
    if (bestSnap !== null) {
      body.y = bestSnap;
      body.vy = 0;
      grounded = true;
    }
  } else if (body.vy < 0) {
    let bestSnap = null;
    for (const p of platforms) {
      if (!aabbOverlap(body, p) || !hOverlap(body, p)) continue;
      const ceiling = p.y + p.h;
      const crossedCeiling = prevY >= ceiling && head <= ceiling;
      if (!crossedCeiling) continue;
      const snapY = ceiling;
      if (bestSnap === null || snapY > bestSnap) bestSnap = snapY;
    }
    if (bestSnap !== null) {
      body.y = bestSnap;
      body.vy = 0;
      hitCeiling = true;
    }
  } else if (body.vy === 0) {
    for (const p of platforms) {
      if (!hOverlap(body, p)) continue;
      const top = p.y;
      if (Math.abs(feet - top) <= 8) {
        body.y = top - body.h;
        grounded = true;
        break;
      }
    }
  }

  body.x += body.vx * dt;
  for (const p of platforms) {
    if (!aabbOverlap(body, p)) continue;
    if (body.vx > 0) {
      body.x = p.x - body.w;
      body.vx = 0;
    } else if (body.vx < 0) {
      body.x = p.x + p.w;
      body.vx = 0;
    }
  }

  return { grounded, hitCeiling };
}

export function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

/** Place player on the nearest platform top under their feet (spawn / respawn). */
export function snapPlayerToGround(player, platforms) {
  player.vy = 0;
  let bestTop = null;
  for (const p of platforms) {
    if (!hOverlap(player, p)) continue;
    const top = p.y;
    const feet = player.y + player.h;
    if (feet < top - 12 || feet > top + 16) continue;
    if (bestTop === null || top > bestTop) bestTop = top;
  }
  if (bestTop !== null) {
    player.y = bestTop - player.h;
    player.grounded = true;
    return;
  }
  player.grounded = false;
}
