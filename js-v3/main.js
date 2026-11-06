import { createInput } from "/js-v3/input.js";
import {
  STATE,
  createGame,
  startLevel,
  returnToMenu,
  updateGame,
  drawGame,
  updateHud,
  updateOverlay,
} from "/js-v3/game.js";
import { VIEW_W, VIEW_H } from "/js-v3/constants.js";
import { saveUsername } from "/js-v3/storage.js";

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const livesEl = document.getElementById("lives");
const scoreEl = document.getElementById("score");
const nameEl = document.getElementById("player-name");
const coinsEl = document.getElementById("coins");
const noticeEl = document.getElementById("notice");
const overlay = document.getElementById("overlay");
const overlayTitle = document.getElementById("overlay-title");
const menu = document.getElementById("menu");
const nameInput = document.getElementById("player-name-input");
const hud = document.getElementById("hud");
const hint = document.getElementById("controls-hint");
const backToMenu = document.getElementById("back-to-menu");
const exitToMenu = document.getElementById("exit-to-menu");
const levelCards = [...document.querySelectorAll(".level-card")];

canvas.width = VIEW_W;
canvas.height = VIEW_H;

const input = createInput(canvas);
const game = createGame();
window.__plumberGame = game;

nameInput.value = game.username;
syncMenuCards();
nameInput.focus();

function syncMenuCards() {
  for (const card of levelCards) {
    const id = Number(card.dataset.level);
    card.classList.toggle("locked", id > game.unlockedMax);
  }
}

function showMenu() {
  menu.classList.remove("hidden");
  hud.classList.add("hidden");
  hint.classList.add("hidden");
  overlay.classList.add("hidden");
  noticeEl.classList.add("hidden");
  exitToMenu.classList.add("hidden");
  syncMenuCards();
  nameInput.value = game.username;
  nameInput.focus();
}

function showPlayHud() {
  menu.classList.add("hidden");
  hud.classList.remove("hidden");
  hint.classList.remove("hidden");
  exitToMenu.classList.remove("hidden");
  canvas.focus();
}

function persistName() {
  game.username = nameInput.value.trim().slice(0, 16);
  nameInput.value = game.username;
  saveUsername(game.username);
}

nameInput.addEventListener("input", persistName);
nameInput.addEventListener("change", persistName);
nameInput.addEventListener("keydown", (e) => e.stopPropagation());
nameInput.addEventListener("keyup", (e) => e.stopPropagation());

function tryStart(levelId) {
  if (levelId > game.unlockedMax) return;
  persistName();
  startLevel(game, levelId, game.username);
  showPlayHud();
}

for (const card of levelCards) {
  card.addEventListener("click", () => tryStart(Number(card.dataset.level)));
}

function goToMenu() {
  returnToMenu(game);
  showMenu();
}

backToMenu.addEventListener("click", goToMenu);
exitToMenu.addEventListener("click", goToMenu);

let lastTime = performance.now();
const MAX_DT = 1 / 30;

function frame(now) {
  let dt = (now - lastTime) / 1000;
  lastTime = now;
  if (dt > MAX_DT) dt = MAX_DT;

  updateGame(game, input, dt);
  ctx.clearRect(0, 0, VIEW_W, VIEW_H);
  drawGame(ctx, game);
  if (game.state !== STATE.MENU) {
    updateHud(game, livesEl, scoreEl, nameEl, coinsEl, noticeEl);
  }
  updateOverlay(game, overlay, overlayTitle);

  requestAnimationFrame(frame);
}

requestAnimationFrame(frame);
