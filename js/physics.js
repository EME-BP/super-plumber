/** @typedef {{ x: number, y: number, w: number, h: number }} AABB */

export function aabbOverlap(a, b) {
  return (
    a.x < b.x + b.w &&
    a.x + a.w > b.x &&
    a.y < b.y + b.h &&
    a.y + a.h > b.y
  );
}

/**
 * @param {{ x: number, y: number, w: number, h: number, vx: number, vy: number }} body
 * @param {AABB[]} platforms
 * @returns {{ grounded: boolean, hitCeiling: boolean }}
 */
export function resolvePlatforms(body, platforms) {
  let grounded = false;
  let hitCeiling = false;

  body.y += body.vy;
  for (const p of platforms) {
    if (!aabbOverlap(body, p)) continue;
    if (body.vy > 0) {
      body.y = p.y - body.h;
      body.vy = 0;
      grounded = true;
    } else if (body.vy < 0) {
      body.y = p.y + p.h;
      body.vy = 0;
      hitCeiling = true;
    }
  }

  body.x += body.vx;
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
