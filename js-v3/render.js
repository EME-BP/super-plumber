import { VIEW_W, VIEW_H, TILE } from "/js-v3/constants.js";
import { clamp } from "/js-v3/physics.js";

export function computeCamera(playerX, playerY, playerH, worldWidth) {
  const target = playerX - VIEW_W * 0.35;
  const cameraX = Math.round(clamp(target, 0, Math.max(0, worldWidth - VIEW_W)));
  const feet = playerY + playerH;
  const focusLine = VIEW_H * 0.58;
  let cameraY = feet - focusLine;
  const marginTop = 72;
  const marginBottom = 36;
  if (playerY - cameraY < marginTop) {
    cameraY = playerY - marginTop;
  }
  if (feet - cameraY > VIEW_H - marginBottom) {
    cameraY = feet - (VIEW_H - marginBottom);
  }
  cameraY = Math.round(clamp(cameraY, 0, 220));
  return { cameraX, cameraY };
}

function worldToScreen(wx, wy, cameraX, cameraY) {
  return { x: wx - cameraX, y: wy - cameraY };
}

export function drawMenuBackdrop(ctx) {
  ctx.fillStyle = "#5c94fc";
  ctx.fillRect(0, 0, VIEW_W, VIEW_H);
  ctx.fillStyle = "#c84c0c";
  ctx.fillRect(0, VIEW_H * 0.58, VIEW_W, VIEW_H * 0.42);
  ctx.strokeStyle = "#6b3e14";
  ctx.lineWidth = 2;
  for (let y = VIEW_H * 0.58; y < VIEW_H; y += 28) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(VIEW_W, y);
    ctx.stroke();
    const offset = ((y / 28) | 0) % 2 === 0 ? 0 : 32;
    for (let x = offset; x < VIEW_W; x += 64) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x, y + 28);
      ctx.stroke();
    }
  }
  ctx.fillStyle = "#43b047";
  ctx.fillRect(0, VIEW_H * 0.58 - 10, VIEW_W, 10);
}

export function drawWorld(ctx, level, cameraX, cameraY, time) {
  const theme = level.theme;

  if (theme === "haunted") {
    drawHauntedSky(ctx);
    drawHouseLayer(ctx, cameraX, cameraY, 0.18, "#1a1224", 0.7);
    drawHouseLayer(ctx, cameraX, cameraY, 0.34, "#120c1a", 0.9);
    drawMoon(ctx, cameraX, cameraY);
    for (const c of level.clouds) drawWindowGlow(ctx, c, cameraX, cameraY);
    for (const t of level.trees) drawDeadTree(ctx, t.x, t.y, t.scale ?? 1, cameraX, cameraY);
  } else if (theme === "desert") {
    drawDesertSky(ctx);
    drawDuneLayer(ctx, cameraX, cameraY, 0.2, "#c48a3a", 300);
    drawDuneLayer(ctx, cameraX, cameraY, 0.38, "#b8752c", 350);
    drawPyramids(ctx, cameraX, cameraY);
    for (const c of level.clouds) {
      const { x: cx, y: cy } = worldToScreen(c.x, c.y, cameraX * 0.2, cameraY * 0.1);
      if (cx + c.w < -40 || cx > VIEW_W + 40) continue;
      ctx.fillStyle = "rgba(255,245,210,0.55)";
      roundRect(ctx, cx, cy, c.w, c.h, 12);
      ctx.fill();
    }
    for (const t of level.trees) drawCactusProp(ctx, t.x, t.y, t.scale ?? 1, cameraX, cameraY);
  } else if (theme === "city") {
    drawCitySky(ctx);
    drawSkyline(ctx, cameraX, cameraY, 0.2, "#1b2436");
    drawSkyline(ctx, cameraX, cameraY, 0.36, "#121826");
    for (const c of level.clouds) drawWindowGlow(ctx, c, cameraX, cameraY);
    for (const t of level.trees) drawAntenna(ctx, t.x, t.y, t.scale ?? 1, cameraX, cameraY);
  } else {
    const grad = ctx.createLinearGradient(0, 0, 0, VIEW_H);
    grad.addColorStop(0, "#7eb8d8");
    grad.addColorStop(0.45, "#b8d4e8");
    grad.addColorStop(0.75, "#e8dcc8");
    grad.addColorStop(1, "#c4a574");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, VIEW_W, VIEW_H);
    drawMountainLayer(ctx, cameraX, cameraY, 0.15, "#5a6b7a", 280, 0.55);
    drawMountainLayer(ctx, cameraX, cameraY, 0.28, "#4a5568", 320, 0.7);
    drawMountainLayer(ctx, cameraX, cameraY, 0.42, "#3d4654", 360, 0.85);
    for (const c of level.clouds) {
      const { x: cx, y: cy } = worldToScreen(c.x, c.y, cameraX * 0.25, cameraY * 0.15);
      if (cx + c.w < -50 || cx > VIEW_W + 50) continue;
      ctx.fillStyle = "rgba(255,255,255,0.75)";
      roundRect(ctx, cx, cy, c.w, c.h, 18);
      ctx.fill();
    }
    for (const t of level.trees) drawTree(ctx, t.x, t.y, t.scale ?? 1, cameraX, cameraY);
  }

  for (const p of level.platforms) {
    const sx = p.x - cameraX;
    const sy = p.y - cameraY;
    if (sx + p.w < -TILE || sx > VIEW_W + TILE) continue;

    if (p.kind === "rock") {
      drawRock(ctx, sx, sy, p.w, p.h);
      continue;
    }
    if (p.kind === "grave") {
      drawGrave(ctx, sx, sy, p.w, p.h);
      continue;
    }
    if (p.kind === "cactus") {
      drawCactusBlock(ctx, sx, sy, p.w, p.h);
      continue;
    }
    if (p.kind === "roof") {
      drawRoof(ctx, sx, sy, p.w, p.h);
      continue;
    }

    const isGround = p.kind === "ground";
    let base = "#7a5c3e";
    if (isGround) {
      if (theme === "haunted") base = "#3d2b22";
      else if (theme === "desert") base = "#c4a35a";
      else base = "#5d7a4a";
    } else if (p.kind === "question") {
      base = theme === "haunted" ? "#5c3b12" : "#8b6914";
    } else if (theme === "haunted") base = "#4a3428";
    else if (theme === "desert") base = "#b07a3a";

    ctx.fillStyle = base;
    ctx.fillRect(sx, sy, p.w, p.h);

    if (isGround) {
      ctx.fillStyle =
        theme === "haunted" ? "#6b4a32" : theme === "desert" ? "#e0c078" : "#6fa858";
      ctx.fillRect(sx, sy, p.w, 10);
      if (theme === "haunted" || theme === "desert") {
        ctx.strokeStyle = "rgba(0,0,0,0.28)";
        ctx.lineWidth = 1;
        for (let px = sx; px < sx + p.w; px += 28) {
          ctx.beginPath();
          ctx.moveTo(px, sy);
          ctx.lineTo(px, sy + p.h);
          ctx.stroke();
        }
      }
    }

    ctx.strokeStyle = "rgba(0,0,0,0.2)";
    ctx.lineWidth = 2;
    const cols = Math.ceil(p.w / TILE);
    const rows = Math.ceil(p.h / TILE);
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const bx = sx + col * TILE;
        const by = sy + row * TILE;
        const bw = Math.min(TILE, sx + p.w - bx);
        const bh = Math.min(TILE, sy + p.h - by);
        ctx.strokeRect(bx + 1, by + 1, bw - 2, bh - 2);
        if (p.kind === "question") {
          ctx.fillStyle = "#ffd966";
          ctx.font = "bold 22px sans-serif";
          ctx.fillText("?", bx + bw / 2 - 6, by + bh / 2 + 8);
          ctx.fillStyle = base;
        }
      }
    }
  }

  const flag = worldToScreen(level.flag.x, level.flag.y, cameraX, cameraY);
  if (theme === "haunted") drawDoor(ctx, flag.x, flag.y, level.flag.w, level.flag.h, time);
  else if (theme === "city") drawBeacon(ctx, flag.x, flag.y, level.flag.w, level.flag.h, time);
  else drawFlag(ctx, flag.x, flag.y, level.flag.w, level.flag.h, time);
}

function drawHauntedSky(ctx) {
  const grad = ctx.createLinearGradient(0, 0, 0, VIEW_H);
  grad.addColorStop(0, "#0c0818");
  grad.addColorStop(0.4, "#1b1230");
  grad.addColorStop(0.75, "#2c1a28");
  grad.addColorStop(1, "#3a2418");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, VIEW_W, VIEW_H);
}

function drawDesertSky(ctx) {
  const grad = ctx.createLinearGradient(0, 0, 0, VIEW_H);
  grad.addColorStop(0, "#f2c56b");
  grad.addColorStop(0.45, "#f0a54a");
  grad.addColorStop(1, "#d47a2c");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, VIEW_W, VIEW_H);
}

function drawCitySky(ctx) {
  const grad = ctx.createLinearGradient(0, 0, 0, VIEW_H);
  grad.addColorStop(0, "#1b2a4a");
  grad.addColorStop(0.45, "#3d3a6b");
  grad.addColorStop(0.8, "#c45c4a");
  grad.addColorStop(1, "#e08a4a");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, VIEW_W, VIEW_H);
}

function drawMoon(ctx, cameraX, cameraY) {
  const x = 140 - cameraX * 0.04;
  const y = 70 - cameraY * 0.08;
  ctx.fillStyle = "rgba(255, 244, 210, 0.95)";
  ctx.beginPath();
  ctx.arc(x, y, 28, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#1b1230";
  ctx.beginPath();
  ctx.arc(x + 10, y - 4, 22, 0, Math.PI * 2);
  ctx.fill();
}

function drawHouseLayer(ctx, cameraX, cameraY, parallax, color, scale) {
  ctx.fillStyle = color;
  const base = 390 - cameraY * 0.25;
  for (let i = -1; i < 10; i++) {
    const x = i * 180 - ((cameraX * parallax) % 180);
    const w = 90 * scale;
    const h = (70 + (i % 3) * 18) * scale;
    ctx.fillRect(x + 20, base - h, w, h);
    ctx.beginPath();
    ctx.moveTo(x + 12, base - h);
    ctx.lineTo(x + 20 + w / 2, base - h - 28 * scale);
    ctx.lineTo(x + 28 + w, base - h);
    ctx.closePath();
    ctx.fill();
  }
}

function drawDuneLayer(ctx, cameraX, cameraY, parallax, color, baseY) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(0, VIEW_H);
  for (let sx = -40; sx <= VIEW_W + 40; sx += 80) {
    const wx = sx + cameraX * parallax;
    const h = baseY - cameraY * 0.2 + Math.sin(wx * 0.01) * 28;
    ctx.lineTo(sx, h);
  }
  ctx.lineTo(VIEW_W, VIEW_H);
  ctx.closePath();
  ctx.fill();
}

function drawPyramids(ctx, cameraX, cameraY) {
  const bases = [180, 520, 880];
  for (const b of bases) {
    const x = b - cameraX * 0.12;
    const y = 360 - cameraY * 0.15;
    ctx.fillStyle = "#c9964a";
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + 70, y - 90);
    ctx.lineTo(x + 140, y);
    ctx.closePath();
    ctx.fill();
  }
}

function drawSkyline(ctx, cameraX, cameraY, parallax, color) {
  ctx.fillStyle = color;
  const base = 420 - cameraY * 0.2;
  for (let i = -1; i < 14; i++) {
    const x = i * 90 - ((cameraX * parallax) % 90);
    const h = 70 + ((i * 17) % 90);
    ctx.fillRect(x, base - h, 70, h);
  }
}

function drawWindowGlow(ctx, c, cameraX, cameraY) {
  const { x, y } = worldToScreen(c.x, c.y, cameraX * 0.22, cameraY * 0.12);
  if (x + c.w < -20 || x > VIEW_W + 20) return;
  ctx.fillStyle = "rgba(230, 190, 80, 0.55)";
  ctx.fillRect(x, y, c.w, c.h);
}

function drawMountainLayer(ctx, cameraX, cameraY, parallax, color, baseY, peakFactor) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(0, VIEW_H);
  const step = 120;
  for (let sx = -step; sx <= VIEW_W + step; sx += step) {
    const wx = sx + cameraX * parallax;
    const h = baseY - cameraY * peakFactor + Math.sin(wx * 0.008) * 40 + Math.cos(wx * 0.015) * 25;
    ctx.lineTo(sx, h);
  }
  ctx.lineTo(VIEW_W, VIEW_H);
  ctx.closePath();
  ctx.fill();
}

function drawTree(ctx, wx, wy, scale, cameraX, cameraY) {
  const { x, y } = worldToScreen(wx, wy, cameraX, cameraY);
  if (x < -80 || x > VIEW_W + 80) return;
  const trunkW = 14 * scale;
  const trunkH = 36 * scale;
  ctx.fillStyle = "#5c3d2e";
  ctx.fillRect(x - trunkW / 2, y - trunkH, trunkW, trunkH);
  ctx.fillStyle = "#2d6a3e";
  ctx.beginPath();
  ctx.moveTo(x, y - trunkH - 50 * scale);
  ctx.lineTo(x + 28 * scale, y - trunkH + 4);
  ctx.lineTo(x - 28 * scale, y - trunkH + 4);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#3d8a52";
  ctx.beginPath();
  ctx.arc(x, y - trunkH - 22 * scale, 22 * scale, 0, Math.PI * 2);
  ctx.fill();
}

function drawDeadTree(ctx, wx, wy, scale, cameraX, cameraY) {
  const { x, y } = worldToScreen(wx, wy, cameraX, cameraY);
  if (x < -80 || x > VIEW_W + 80) return;
  ctx.strokeStyle = "#2a1c16";
  ctx.fillStyle = "#2a1c16";
  ctx.lineWidth = 3 * scale;
  ctx.fillRect(x - 4 * scale, y - 46 * scale, 8 * scale, 46 * scale);
  ctx.beginPath();
  ctx.moveTo(x, y - 40 * scale);
  ctx.lineTo(x - 18 * scale, y - 62 * scale);
  ctx.moveTo(x, y - 36 * scale);
  ctx.lineTo(x + 16 * scale, y - 58 * scale);
  ctx.moveTo(x, y - 28 * scale);
  ctx.lineTo(x - 12 * scale, y - 44 * scale);
  ctx.stroke();
}

function drawCactusProp(ctx, wx, wy, scale, cameraX, cameraY) {
  const { x, y } = worldToScreen(wx, wy, cameraX, cameraY);
  if (x < -60 || x > VIEW_W + 60) return;
  ctx.fillStyle = "#2f7a3a";
  ctx.fillRect(x - 5 * scale, y - 48 * scale, 10 * scale, 48 * scale);
  ctx.fillRect(x - 18 * scale, y - 34 * scale, 14 * scale, 8 * scale);
  ctx.fillRect(x + 4 * scale, y - 28 * scale, 14 * scale, 8 * scale);
}

function drawAntenna(ctx, wx, wy, scale, cameraX, cameraY) {
  const { x, y } = worldToScreen(wx, wy, cameraX, cameraY);
  if (x < -40 || x > VIEW_W + 40) return;
  ctx.fillStyle = "#9aa3b2";
  ctx.fillRect(x - 1, y - 36 * scale, 3, 36 * scale);
  ctx.fillStyle = "#e52521";
  ctx.beginPath();
  ctx.arc(x, y - 38 * scale, 3, 0, Math.PI * 2);
  ctx.fill();
}

function drawRock(ctx, x, y, w, h) {
  ctx.fillStyle = "#6b7280";
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = "#9ca3af";
  ctx.fillRect(x + 4, y + 4, w - 8, h * 0.35);
}

function drawGrave(ctx, x, y, w, h) {
  ctx.fillStyle = "#4b5563";
  ctx.fillRect(x + 6, y + 12, w - 12, h - 12);
  ctx.beginPath();
  ctx.arc(x + w / 2, y + 16, (w - 12) / 2, Math.PI, 0);
  ctx.fill();
  ctx.fillStyle = "#9ca3af";
  ctx.fillRect(x + w / 2 - 2, y + 22, 4, 18);
  ctx.fillRect(x + w / 2 - 8, y + 28, 16, 4);
}

function drawCactusBlock(ctx, x, y, w, h) {
  ctx.fillStyle = "#2f7a3a";
  ctx.fillRect(x + w * 0.3, y, w * 0.4, h);
  ctx.fillRect(x, y + h * 0.35, w * 0.35, w * 0.28);
  ctx.fillRect(x + w * 0.65, y + h * 0.45, w * 0.35, w * 0.28);
}

function drawRoof(ctx, x, y, w, h) {
  ctx.fillStyle = "#4a5568";
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = "#718096";
  ctx.fillRect(x, y, w, 10);
  ctx.fillStyle = "#fbd000";
  for (let wy = y + 22; wy < y + h - 10; wy += 22) {
    for (let wx = x + 10; wx < x + w - 12; wx += 22) {
      ctx.fillRect(wx, wy, 8, 10);
    }
  }
}

function drawFlag(ctx, x, y, w, h, time) {
  ctx.fillStyle = "#ecf0f1";
  ctx.fillRect(x + w / 2 - 4, y, 8, h);
  ctx.fillStyle = "#27ae60";
  ctx.fillRect(x + w / 2 - 12, y + h - 8, 24, 12);
  const wave = Math.sin(time * 4) * 4;
  ctx.fillStyle = "#e52521";
  ctx.beginPath();
  ctx.moveTo(x + w / 2 + 4, y + 16);
  ctx.lineTo(x + w / 2 + 44 + wave, y + 32);
  ctx.lineTo(x + w / 2 + 4, y + 48);
  ctx.closePath();
  ctx.fill();
}

function drawDoor(ctx, x, y, w, h, time) {
  ctx.fillStyle = "#2b1a14";
  ctx.fillRect(x, y + 20, w + 18, h - 20);
  ctx.fillStyle = "#4a2c22";
  ctx.beginPath();
  ctx.moveTo(x - 6, y + 24);
  ctx.lineTo(x + (w + 18) / 2, y);
  ctx.lineTo(x + w + 24, y + 24);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#1a100c";
  ctx.fillRect(x + 10, y + 48, w - 2, h - 48);
  const glow = 0.45 + 0.25 * Math.sin(time * 3);
  ctx.fillStyle = `rgba(240, 180, 70, ${glow})`;
  ctx.beginPath();
  ctx.arc(x + w + 4, y + 70, 7, 0, Math.PI * 2);
  ctx.fill();
}

function drawBeacon(ctx, x, y, w, h, time) {
  ctx.fillStyle = "#9aa3b2";
  ctx.fillRect(x + w / 2 - 4, y, 8, h);
  ctx.fillStyle = "#4a5568";
  ctx.fillRect(x + w / 2 - 14, y + h - 16, 28, 16);
  const glow = 0.5 + 0.4 * Math.sin(time * 5);
  ctx.fillStyle = `rgba(229, 37, 33, ${glow})`;
  ctx.beginPath();
  ctx.arc(x + w / 2, y + 10, 8, 0, Math.PI * 2);
  ctx.fill();
}

export function drawCoin(ctx, coin, cameraX, cameraY) {
  if (coin.collected) return;
  const cx = coin.x - cameraX;
  const cy = coin.y - cameraY;
  const scale = 0.55 + 0.45 * Math.abs(Math.cos(coin.spin));
  const r = coin.r * scale;
  ctx.fillStyle = "#fbd000";
  ctx.beginPath();
  ctx.ellipse(cx, cy, r, coin.r, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#c84c0c";
  ctx.lineWidth = 2;
  ctx.stroke();
}

export function drawEnemy(ctx, enemy, cameraX, cameraY, theme = "mountain") {
  if (!enemy.alive) return;
  const x = enemy.x - cameraX;
  const y = enemy.y - cameraY;

  if (theme === "haunted") {
    ctx.fillStyle = "rgba(230, 236, 245, 0.9)";
    ctx.beginPath();
    ctx.ellipse(x + enemy.w / 2, y + enemy.h / 2 - 2, enemy.w / 2, enemy.h / 2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#1a1020";
    ctx.beginPath();
    ctx.ellipse(x + 12, y + 14, 3.5, 5, 0, 0, Math.PI * 2);
    ctx.ellipse(x + 22, y + 14, 3.5, 5, 0, 0, Math.PI * 2);
    ctx.fill();
    return;
  }

  if (theme === "desert") {
    ctx.fillStyle = "#8a3a12";
    ctx.fillRect(x + 4, y + 14, enemy.w - 8, 12);
    ctx.fillRect(x + 2, y + 24, 8, 10);
    ctx.fillRect(x + enemy.w - 10, y + 24, 8, 10);
    ctx.fillStyle = "#111";
    ctx.fillRect(x + 10, y + 16, 4, 4);
    ctx.fillRect(x + 20, y + 16, 4, 4);
    return;
  }

  if (theme === "city") {
    ctx.fillStyle = "#d8dce3";
    ctx.beginPath();
    ctx.ellipse(x + enemy.w / 2, y + 16, 12, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#4a5568";
    ctx.fillRect(x + 8, y + 20, 6, 10);
    ctx.fillRect(x + 20, y + 20, 6, 10);
    ctx.fillStyle = "#111";
    ctx.fillRect(x + 12, y + 13, 3, 3);
    ctx.fillRect(x + 20, y + 13, 3, 3);
    return;
  }

  ctx.fillStyle = "#8B4513";
  ctx.beginPath();
  ctx.ellipse(x + enemy.w / 2, y + enemy.h / 2 + 4, enemy.w / 2, enemy.h / 2 - 2, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#fff";
  ctx.fillRect(x + 8, y + 12, 8, 10);
  ctx.fillRect(x + 20, y + 12, 8, 10);
  ctx.fillStyle = "#111";
  ctx.fillRect(x + 10, y + 16, 4, 4);
  ctx.fillRect(x + 22, y + 16, 4, 4);
  ctx.fillStyle = "#5c3317";
  ctx.fillRect(x + 4, y + enemy.h - 6, 10, 6);
  ctx.fillRect(x + enemy.w - 14, y + enemy.h - 6, 10, 6);
}

export function drawPlayer(ctx, player, cameraX, cameraY, blinkVisible, animTime = 0) {
  const x = Math.round(player.x - cameraX);
  const y = Math.round(player.y - cameraY);
  ctx.save();
  if (!blinkVisible) ctx.globalAlpha = 0.55;

  ctx.fillStyle = "#e52521";
  ctx.fillRect(x + 2, y, player.w - 4, 14);
  ctx.fillStyle = "#c5130f";
  ctx.fillRect(x, y + 10, player.w, 6);

  ctx.fillStyle = "#5c94fc";
  ctx.fillRect(x + 4, y + 16, player.w - 8, 16);

  ctx.fillStyle = "#f5cba7";
  ctx.fillRect(x + 6, y + 14, 8, 8);
  ctx.fillRect(x + player.w - 14, y + 14, 8, 8);

  ctx.fillStyle = "#2c3e50";
  const legAnim = player.grounded && player.runAnim;
  const legStep = legAnim ? Math.floor(animTime * 5) % 2 : 0;
  const legOff = legStep === 1 ? 2 : 0;
  ctx.fillRect(x + 6, y + 32, 8, 8 + legOff);
  ctx.fillRect(x + player.w - 14, y + 32, 8, 8 - legOff);
  ctx.restore();
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}
