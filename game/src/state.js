// Sizzle Rush — the whole game state in one plain object, plus the
// functions that create it and reset it for a new shift.

import {
  SHIFT_SECONDS,
  MAX_STRIKES,
  CHEF_RADIUS,
} from './config.js';

// A station's live contents. `item` is an ingredient id (or null), and
// `progress` runs 0..1 while chopping or grilling. `burnt` marks a patty
// left on the grill too long.
export function makeStation(id, kind, x, y, w, h, label) {
  return { id, kind, x, y, w, h, label, item: null, progress: 0, burnt: false };
}

export function createState() {
  return {
    screen: 'title', // title | play | summary
    timeLeft: SHIFT_SECONDS,
    score: 0,
    coins: 0,
    served: 0,
    combo: 0,
    bestCombo: 0,
    strikes: 0,
    maxStrikes: MAX_STRIKES,
    rush: false,
    paused: false,
    frozen: false, // staged screenshot scene: clock stopped, no overlay
    muted: false,
    orderTimer: 0,
    orders: [], // { id, recipe, patience, maxPatience }
    nextOrderId: 1,
    chef: {
      x: 640,
      y: 470,
      r: CHEF_RADIUS,
      dir: 1, // 1 facing right, -1 facing left
      moving: false,
      carry: null, // ingredient id, 'cookedPatty', or { plate: [...] }
      bob: 0,
    },
    stations: [],
    plate: [], // ingredients on the plate at the plating station
    readyPlate: null, // a finished plate waiting on the pass (staged shots)
    floaters: [], // { x, y, text, color, life }
    particles: [], // { x, y, vx, vy, life, color, size }
    shake: 0,
    summary: null, // filled when the shift ends
    shot: null, // name of a staged screenshot scene, or null
    elapsed: 0,
  };
}

// Put the stations back the way a fresh shift starts: every counter
// empty, the plating station holding one clean plate.
export function resetShift(state) {
  state.timeLeft = SHIFT_SECONDS;
  state.score = 0;
  state.coins = 0;
  state.served = 0;
  state.combo = 0;
  state.bestCombo = 0;
  state.strikes = 0;
  state.rush = false;
  state.paused = false;
  state.frozen = false;
  state.orderTimer = 0;
  state.orders = [];
  state.nextOrderId = 1;
  state.chef.x = 640;
  state.chef.y = 470;
  state.chef.carry = null;
  state.plate = [];
  state.readyPlate = null;
  state.floaters = [];
  state.particles = [];
  state.shake = 0;
  state.summary = null;
  state.elapsed = 0;
  for (const s of state.stations) {
    s.item = null;
    s.progress = 0;
    s.burnt = false;
  }
}
