// Sizzle Rush — staged scenes for the entry's screenshots. Each scene
// sets the live game state to one busy, readable moment and freezes the
// clock, so the screenshot is a real render of the game's own code in
// exactly the state the maker chose. Nothing here edits pixels.

import { RECIPES } from './config.js';

function recipeById(id) {
  return RECIPES.find((r) => r.id === id);
}

function order(id, recipeId, patience, max) {
  return { id, recipe: recipeById(recipeId), patience, maxPatience: max };
}

function floater(state, x, y, text, color) {
  state.floaters.push({ x, y, text, color, life: 1.2, maxLife: 1.2 });
}

function steam(state, x, y, n) {
  for (let i = 0; i < n; i++) {
    state.particles.push({
      x: x + (i - n / 2) * 14,
      y: y - i * 3,
      vx: 0,
      vy: -14,
      life: 1.5,
      maxLife: 1.5,
      color: 'rgba(255,255,255,0.85)',
      size: 5,
    });
  }
}

// The cover: the whole game in one frame — three tickets, a burger
// mid-assembly on the plating station, the chef carrying a tomato to
// the board, a cooked patty on the grill, and a finished plate waiting
// on the pass.
function stageCover(state) {
  state.timeLeft = 107;
  state.coins = 46;
  state.served = 2;
  state.combo = 2;
  state.orders = [
    order(7, 'classic', 34, 48),
    order(8, 'melt', 22, 48),
    order(9, 'garden', 41, 48),
  ];
  state.plate = ['bun', 'cookedPatty', 'tomato'];
  const grill = state.stations.find((s) => s.id === 'grill');
  grill.item = 'patty';
  grill.progress = 1;
  grill.burnt = false;
  const pass = state.stations.find((s) => s.id === 'pass');
  pass.item = null;
  state.readyPlate = ['bun', 'cookedPatty', 'cheese']; // finished melt, ready to serve
  state.chef.x = 330;
  state.chef.y = 420;
  state.chef.dir = 1;
  state.chef.carry = 'tomato';
  state.chef.moving = true;
  steam(state, 640, 320, 4);
  floater(state, 1085, 540, '+26', '#2e7d32');
}

// Chopping in progress: the chef works the board while a patty grills
// and two tickets wait, one nearly out of patience.
function stageChop(state) {
  state.timeLeft = 84;
  state.coins = 24;
  state.served = 1;
  state.combo = 0;
  state.orders = [
    order(5, 'classic', 12, 48),
    order(6, 'garden', 38, 48),
  ];
  const board = state.stations.find((s) => s.id === 'board');
  board.item = 'lettuce';
  board.progress = 0.55;
  const grill = state.stations.find((s) => s.id === 'grill');
  grill.item = 'patty';
  grill.progress = 0.6;
  grill.burnt = false;
  state.chef.x = 165;
  state.chef.y = 420;
  state.chef.dir = 1;
  state.chef.carry = null;
  state.chef.moving = false;
  steam(state, 640, 320, 3);
}

// The dinner rush: four tickets, two almost expired, the chef sprinting
// to the grill while a chopped onion waits on the board.
function stageRush(state) {
  state.timeLeft = 28;
  state.rush = true;
  state.coins = 88;
  state.served = 4;
  state.combo = 3;
  state.orders = [
    order(11, 'double', 8, 48),
    order(12, 'classic', 15, 48),
    order(13, 'melt', 26, 48),
    order(14, 'garden', 33, 48),
  ];
  const board = state.stations.find((s) => s.id === 'board');
  board.item = 'onion';
  board.progress = 1;
  const grill = state.stations.find((s) => s.id === 'grill');
  grill.item = 'patty';
  grill.progress = 1;
  grill.burnt = false;
  state.chef.x = 560;
  state.chef.y = 430;
  state.chef.dir = 1;
  state.chef.carry = 'cheese';
  state.chef.moving = true;
  steam(state, 640, 320, 5);
  floater(state, 640, 250, 'RUSH!', '#e8483f');
}

// The serve: a finished Cheese Melt on the pass, coins popping, the
// chef stepping back with the combo climbing.
function stageServed(state) {
  state.timeLeft = 61;
  state.coins = 112;
  state.served = 5;
  state.combo = 4;
  state.orders = [
    order(15, 'classic', 30, 48),
    order(16, 'crunch', 44, 48),
  ];
  state.plate = [];
  state.readyPlate = ['bun', 'cookedPatty', 'cheese']; // the melt just served
  state.chef.x = 900;
  state.chef.y = 500;
  state.chef.dir = -1;
  state.chef.carry = null;
  state.chef.moving = false;
  floater(state, 1085, 505, '+38', '#2e7d32');
  floater(state, 1085, 540, 'COMBO ×4', '#c25e2e');
  for (let i = 0; i < 14; i++) {
    state.particles.push({
      x: 1085 + (Math.random() - 0.5) * 160,
      y: 580 + (Math.random() - 0.5) * 60,
      vx: 0,
      vy: -20,
      life: 1.4,
      maxLife: 1.4,
      color: ['#f7c948', '#ff9d5c', '#7ec850'][i % 3],
      size: 4,
    });
  }
}

const SCENES = { cover: stageCover, chop: stageChop, rush: stageRush, served: stageServed };

// Stage one scene by name. Returns true when the name was known. The
// clock freezes so the frame never changes while the shot is taken.
export function stageShot(state, name) {
  const fn = SCENES[name];
  if (!fn) return false;
  state.screen = 'play';
  state.frozen = true;
  state.shot = name;
  fn(state);
  return true;
}

export function shotNames() {
  return Object.keys(SCENES);
}
