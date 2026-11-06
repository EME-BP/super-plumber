import { VIEW_W, VIEW_H, TILE } from "/js/constants.js";
import { clamp } from "/js/physics.js";

export function computeCamera(playerX, worldWidth) {
  const target = playerX - VIEW_W * 0.35;
  return clamp(target, 0, Math.max(0, worldWidth - VIEW_W));
}

export function drawWorld(ctx, level, cameraX, time) {
  const grad = ctx.createLinearGradient(0, 0, 0, VIEW_H);
  grad.addColorStop(0, "#5eb8f0");
  grad.addColorStop(0.55, "#87ceeb");
  grad.addColorStop(1, "#c9e8ff");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, VIEW_W, VIEW_H);

  for (const c of level.clouds) {
    const cx = c.x - cameraX * 0.3;
    if (cx + c.w < -50 || cx > VIEW_W + 50) continue;
    ctx.fillStyle = "rgba(255,255,255,0.92)";
    roundRect(ctx, cx, c.y, c.w, c.h, 18);
    ctx.fill();
    roundRect(ctx, cx + c.w * 0.2, c.y - 12, c.w * 0.5, c.h * 0.8, 14);
    ctx.fill();
  }

  for (const p of level.platforms) {
    const sx = p.x - cameraX;
    if (sx + p.w < -TILE || sx > VIEW_W + TILE) continue;

    if (p.kind === "pipe") {
      drawPipe(ctx, sx, p.y, p.w, p.h);
      continue;
    }

    const isGround = p.kind === "ground";
    const base = isGround ? "#6b4f2a" : p.kind === "question" ? "#c87820" : "#b85c38";
    ctx.fillStyle = base;
    ctx.fillRect(sx, p.y, p.w, p.h);

    ctx.strokeStyle = "rgba(0,0,0,0.25)";
    ctx.lineWidth = 2;
    const cols = Math.ceil(p.w / TILE);
    const rows = Math.ceil(p.h / TILE);
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const bx = sx + col * TILE;
        const by = p.y + row * TILE;
        const bw = Math.min(TILE, sx + p.w - bx);
        const bh = Math.min(TILE, p.y + p.h - by);
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

  drawFlag(ctx, level.flag.x - cameraX, level.flag.y, level.flag.w, level.flag.h, time);
}

function drawPipe(ctx, x, y, w, h) {
  ctx.fillStyle = "#2ecc71";
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = "#27ae60";
  ctx.fillRect(x - 4, y - 16, w + 8, 20);
  ctx.strokeStyle = "#1e8449";
  ctx.lineWidth = 3;
  ctx.strokeRect(x, y, w, h);
}

function drawFlag(ctx, x, y, w, h, time) {
  ctx.fillStyle = "#ecf0f1";
  ctx.fillRect(x + w / 2 - 4, y, 8, h);
  ctx.fillStyle = "#27ae60";
  ctx.fillRect(x + w / 2 - 12, y + h - 8, 24, 12);

  const wave = Math.sin(time * 4) * 4;
  ctx.fillStyle = "#e74c3c";
  ctx.beginPath();
  ctx.moveTo(x + w / 2 + 4, y + 16);
  ctx.lineTo(x + w / 2 + 44 + wave, y + 32);
  ctx.lineTo(x + w / 2 + 4, y + 48);
  ctx.closePath();
  ctx.fill();
}

export function drawCoin(ctx, coin, cameraX) {
  if (coin.collected) return;
  const cx = coin.x - cameraX;
  const scale = 0.55 + 0.45 * Math.abs(Math.cos(coin.spin));
  const r = coin.r * scale;
  ctx.fillStyle = "#f1c40f";
  ctx.beginPath();
  ctx.ellipse(cx, coin.y, r, coin.r, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#d4ac0d";
  ctx.lineWidth = 2;
  ctx.stroke();
}

export function drawEnemy(ctx, enemy, cameraX) {
  if (!enemy.alive) return;
  const x = enemy.x - cameraX;
  const y = enemy.y;
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

export function drawPlayer(ctx, player, cameraX, blinkVisible, animTime = 0) {
  if (!blinkVisible) return;
  const x = Math.round(player.x - cameraX);
  const y = Math.round(player.y);

  ctx.fillStyle = "#e74c3c";
  ctx.fillRect(x + 2, y, player.w - 4, 14);
  ctx.fillStyle = "#c0392b";
  ctx.fillRect(x, y + 10, player.w, 6);

  ctx.fillStyle = "#3498db";
  ctx.fillRect(x + 4, y + 16, player.w - 8, 16);

  ctx.fillStyle = "#f5cba7";
  ctx.fillRect(x + 6, y + 14, 8, 8);
  ctx.fillRect(x + player.w - 14, y + 14, 8, 8);

  ctx.fillStyle = "#2c3e50";
  const legAnim = player.grounded && player.runAnim;
  const legStep = legAnim ? Math.floor(animTime * 5) % 2 : 0;
  const legOff = legStep === 1 ? 2 : 0;
  // #region agent log
  if (!drawPlayer._dbgN) drawPlayer._dbgN = 0;
  if (++drawPlayer._dbgN % 30 === 0) {
    fetch('http://127.0.0.1:7936/ingest/fc791c09-8db6-4f2a-8df3-297725951093',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'2fd595'},body:JSON.stringify({sessionId:'2fd595',location:'render.js:drawPlayer',message:'leg sample',data:{legAnim,legOff,vx:player.vx,grounded:player.grounded,facing:player.facing},timestamp:Date.now(),hypothesisId:'H2'})}).catch(()=>{});
  }
  // #endregion
  ctx.fillRect(x + 6, y + 32, 8, 8 + legOff);
  ctx.fillRect(x + player.w - 14, y + 32, 8, 8 - legOff);
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
