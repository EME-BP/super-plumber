import { createInput } from "/js/input.js";
import {
  createGame,
  updateGame,
  drawGame,
  updateHud,
  updateOverlay,
} from "/js/game.js";
import { VIEW_W, VIEW_H, RUN_SPEED, RUN_ACCEL, DEBUG_BUILD } from "/js/constants.js";

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const livesEl = document.getElementById("lives");
const scoreEl = document.getElementById("score");
const overlay = document.getElementById("overlay");
const overlayTitle = document.getElementById("overlay-title");
const buildEl = document.getElementById("build-tag");

canvas.width = VIEW_W;
canvas.height = VIEW_H;
canvas.focus();

if (buildEl) buildEl.textContent = DEBUG_BUILD;

const input = createInput(canvas);
const game = createGame();

// #region agent log
fetch('http://127.0.0.1:7936/ingest/fc791c09-8db6-4f2a-8df3-297725951093',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'2fd595'},body:JSON.stringify({sessionId:'2fd595',runId:'post-fix',location:'main.js:init',message:'build loaded',data:{build:DEBUG_BUILD,runSpeed:RUN_SPEED,runAccel:RUN_ACCEL},timestamp:Date.now(),hypothesisId:'H7'})}).catch(()=>{});
// #endregion

let lastTime = performance.now();
const MAX_DT = 1 / 30;
let dbgFrame = 0;

function frame(now) {
  let dt = (now - lastTime) / 1000;
  lastTime = now;
  if (dt > MAX_DT) dt = MAX_DT;

  updateGame(game, input, dt);
  // #region agent log
  dbgFrame++;
  if (dbgFrame % 25 === 0) {
    const mv = input.left() || input.right();
    fetch('http://127.0.0.1:7936/ingest/fc791c09-8db6-4f2a-8df3-297725951093',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'2fd595'},body:JSON.stringify({sessionId:'2fd595',runId:'post-fix',location:'main.js:frame',message:'move sample',data:{build:DEBUG_BUILD,dt,vx:game.player.vx,moving:mv,left:input.left(),right:input.right(),runSpeed:RUN_SPEED,accel:RUN_ACCEL,runAnim:game.player.runAnim},timestamp:Date.now(),hypothesisId:'H6'})}).catch(()=>{});
  }
  // #endregion
  ctx.clearRect(0, 0, VIEW_W, VIEW_H);
  drawGame(ctx, game);
  updateHud(game, livesEl, scoreEl);
  updateOverlay(game, overlay, overlayTitle);

  requestAnimationFrame(frame);
}

requestAnimationFrame(frame);
