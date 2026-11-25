// Sizzle Rush — entry point: the loop, the update step, and the wiring
// between input, kitchen, orders and sound. Started from index.html.

import { VIEW_W, VIEW_H, CHEF_SPEED, SHIFT_SECONDS } from './config.js';
import { createState, resetShift } from './state.js';
import { buildStations, interact, tickStations, stationNearChef } from './kitchen.js';
import { tickOrders, servePlate, applyExpiry, isRush } from './orders.js';
import { createInput, consumePresses } from './input.js';
import { createAudio, playSound, toggleMute } from './audio.js';
import { render } from './render.js';
import { stageShot } from './shots.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
canvas.width = VIEW_W;
canvas.height = VIEW_H;

const state = createState();
state.stations = buildStations();
const input = createInput(canvas);
const audio = createAudio();

let lastTick = performance.now();
let lastWholeSecond = SHIFT_SECONDS;

function addFloater(x, y, text, color) {
  state.floaters.push({ x, y, text, color, life: 1.4, maxLife: 1.4 });
}

function burst(x, y, colors, n = 16) {
  for (let i = 0; i < n; i++) {
    const a = Math.random() * Math.PI * 2;
    const sp = 40 + Math.random() * 90;
    state.particles.push({
      x, y,
      vx: Math.cos(a) * sp,
      vy: Math.sin(a) * sp - 30,
      life: 0.9,
      maxLife: 0.9,
      color: colors[i % colors.length],
      size: 3 + Math.random() * 4,
    });
  }
}

function startShift() {
  resetShift(state);
  state.screen = 'play';
  playSound(audio, 'start');
}

function endShift(won) {
  const expired = state.strikes;
  const stars = state.served >= 8 ? 3 : state.served >= 5 ? 2 : state.served >= 3 ? 1 : 0;
  state.summary = {
    title: won ? 'Shift complete!' : 'Shift cut short!',
    subtitle: won
      ? 'The dinner crowd went home happy.'
      : 'Too many tickets expired — the kitchen lost its nerve.',
    served: state.served,
    coins: state.coins,
    bestCombo: state.bestCombo,
    expired,
    stars,
  };
  state.screen = 'summary';
}

function doInteract() {
  const ev = interact(state);
  if (ev === 'serve') {
    const carry = state.chef.carry;
    const res = servePlate(state, carry.items);
    if (res) {
      state.chef.carry = null;
      const pass = state.stations.find((s) => s.id === 'pass');
      addFloater(pass.x + pass.w / 2, pass.y - 14, `+${res.coins}`, '#2e7d32');
      burst(pass.x + pass.w / 2, pass.y + 30, ['#f7c948', '#ff9d5c', '#7ec850']);
      playSound(audio, 'serve');
    } else {
      addFloater(state.chef.x, state.chef.y - 60, 'No ticket wants this!', '#e8483f');
      playSound(audio, 'bad');
    }
    return;
  }
  if (ev === 'pickup') playSound(audio, 'pickup');
  else if (ev === 'place') playSound(audio, 'place');
  else if (ev === 'trash') {
    addFloater(state.chef.x, state.chef.y - 60, 'Tossed', '#8a7a68');
    playSound(audio, 'bad');
  } else if (ev === 'blocked') {
    playSound(audio, 'bad');
  }
}

function clickStationAt(x, y) {
  // A click on a station walks the chef's attention there: if the chef
  // is already in reach, use it; otherwise remember nothing — the
  // player walks with the keys.
  const s = state.stations.find(
    (st) => x >= st.x && x <= st.x + st.w && y >= st.y && y <= st.y + st.h,
  );
  if (s && stationNearChef(state) === s) doInteract();
}

function update(dt) {
  if (state.screen !== 'play' || state.paused || state.frozen) return;
  state.elapsed += dt;

  // Floaters and particles animate while the game runs. While paused
  // (including a frozen screenshot scene) they hold still, so a staged
  // frame never changes under the camera.
  for (const f of state.floaters) {
    f.life -= dt;
    f.y -= 28 * dt;
  }
  state.floaters = state.floaters.filter((f) => f.life > 0);
  for (const p of state.particles) {
    p.life -= dt;
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.vy += 60 * dt;
  }
  state.particles = state.particles.filter((p) => p.life > 0);
  if (state.shake > 0) state.shake -= dt;

  // Movement.
  const dx = (input.right ? 1 : 0) - (input.left ? 1 : 0);
  const dy = (input.down ? 1 : 0) - (input.up ? 1 : 0);
  if (dx !== 0 || dy !== 0) {
    const len = Math.hypot(dx, dy);
    state.chef.x += (dx / len) * CHEF_SPEED * dt;
    state.chef.y += (dy / len) * CHEF_SPEED * dt;
    state.chef.dir = dx !== 0 ? Math.sign(dx) : state.chef.dir;
    state.chef.moving = true;
    state.chef.bob += dt * 14;
  } else {
    state.chef.moving = false;
  }
  // Keep the chef on the floor and out of the counters.
  state.chef.x = Math.max(36, Math.min(VIEW_W - 36, state.chef.x));
  state.chef.y = Math.max(240, Math.min(VIEW_H - 40, state.chef.y));
  for (const s of state.stations) {
    const cx = Math.max(s.x, Math.min(state.chef.x, s.x + s.w));
    const cy = Math.max(s.y, Math.min(state.chef.y, s.y + s.h));
    const d = Math.hypot(state.chef.x - cx, state.chef.y - cy);
    if (d < state.chef.r && d > 0) {
      state.chef.x = cx + ((state.chef.x - cx) / d) * state.chef.r;
      state.chef.y = cy + ((state.chef.y - cy) / d) * state.chef.r;
    }
  }

  tickStations(state, dt);
  const expired = tickOrders(state, dt, Math.random);
  for (const o of expired) {
    applyExpiry(state);
    addFloater(640, 110, `Ticket #${o.id} expired!`, '#e8483f');
    state.shake = 0.3;
    playSound(audio, 'bad');
  }

  state.timeLeft -= dt;
  state.rush = isRush(state);
  const whole = Math.ceil(state.timeLeft);
  if (whole !== lastWholeSecond) {
    lastWholeSecond = whole;
    if (whole <= 10 && whole > 0) playSound(audio, 'tick');
  }

  if (state.strikes >= state.maxStrikes) endShift(false);
  else if (state.timeLeft <= 0) endShift(true);
}

function frame(now) {
  const dt = Math.min(0.05, (now - lastTick) / 1000);
  lastTick = now;
  const presses = consumePresses(input);

  if (presses.mute) {
    const muted = toggleMute(audio);
    state.muted = muted;
    addFloater(640, 40, muted ? 'Muted' : 'Sound on', '#fff');
  }
  if (presses.pause && state.screen === 'play') state.paused = !state.paused;
  if (presses.enter) {
    if (state.screen === 'title' || state.screen === 'summary') startShift();
  }
  if (presses.trash && state.screen === 'play' && !state.paused && state.chef.carry) {
    state.chef.carry = null;
    addFloater(state.chef.x, state.chef.y - 60, 'Tossed', '#8a7a68');
  }
  if (presses.interact && state.screen === 'play' && !state.paused) doInteract();
  if (presses.click) {
    const { x, y } = presses.click;
    if (state.screen === 'title' && x >= 490 && x <= 790 && y >= 500 && y <= 556) startShift();
    else if (state.screen === 'summary' && x >= 490 && x <= 790 && y >= 492 && y <= 544) startShift();
    else if (state.screen === 'play' && !state.paused) clickStationAt(x, y);
  }

  update(dt);
  render(ctx, state, state.screen === 'play' ? stationNearChef(state) : null);
  requestAnimationFrame(frame);
}

// A ?shot=name query stages one frozen scene for screenshots. A
// ?seed=n query is accepted and ignored: the scenes are hand-staged.
const params = new URLSearchParams(window.location.search);
const shot = params.get('shot');
if (shot) {
  stageShot(state, shot);
}

// Debug hook for play-testing: the live state is readable from the
// console as window.__sizzle. It changes nothing about the game.
window.__sizzle = state;

requestAnimationFrame(frame);
