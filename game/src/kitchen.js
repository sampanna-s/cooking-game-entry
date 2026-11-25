// Sizzle Rush — the kitchen itself: where every station sits, and what
// happens when the chef uses one. The chef carries one thing at a time:
// a single ingredient, or a whole plate.

import {
  INGREDIENTS,
  COOKED_PATTY,
  CHOP_SECONDS,
  GRILL_SECONDS,
  BURN_SECONDS,
} from './config.js';
import { makeStation } from './state.js';

// Station rectangles in the 1280x720 view. The top row is the ingredient
// bins; the middle row is the work stations; the bottom row is the pass
// and the trash.
export function buildStations() {
  const bins = ['bun', 'patty', 'tomato', 'lettuce', 'cheese', 'onion'];
  const stations = bins.map((id, i) =>
    makeStation('bin-' + id, 'bin', 60 + i * 195, 168, 170, 64, INGREDIENTS[id].name),
  );
  stations.push(makeStation('board', 'board', 90, 300, 210, 90, 'Chopping board'));
  stations.push(makeStation('grill', 'grill', 490, 300, 300, 90, 'Grill'));
  stations.push(makeStation('plate', 'plate', 980, 300, 210, 90, 'Plating'));
  stations.push(makeStation('trash', 'trash', 90, 560, 150, 80, 'Trash'));
  stations.push(makeStation('pass', 'pass', 980, 560, 210, 80, 'Serving pass'));
  return stations;
}

function nearestStation(state) {
  const { x, y } = state.chef;
  let best = null;
  let bestD = 78;
  for (const s of state.stations) {
    const cx = Math.max(s.x, Math.min(x, s.x + s.w));
    const cy = Math.max(s.y, Math.min(y, s.y + s.h));
    const d = Math.hypot(x - cx, y - cy);
    if (d < bestD) {
      bestD = d;
      best = s;
    }
  }
  return best;
}

export function stationNearChef(state) {
  return nearestStation(state);
}

function isPlate(carry) {
  return carry && typeof carry === 'object' && carry.kind === 'plate';
}

// The chef presses E (or clicks a station): do the one sensible thing
// for the station in reach. Returns a short event name for sound and
// feedback, or null when nothing could be done.
export function interact(state) {
  const chef = state.chef;
  const s = nearestStation(state);
  if (!s) return null;

  if (s.kind === 'bin') {
    if (chef.carry) return 'blocked';
    const id = s.id.slice(4);
    chef.carry = id;
    return 'pickup';
  }

  if (s.kind === 'board') {
    if (s.item && s.progress >= 1) {
      if (chef.carry) return 'blocked';
      chef.carry = s.item;
      s.item = null;
      s.progress = 0;
      return 'pickup';
    }
    if (s.item) return 'blocked'; // still chopping
    if (!chef.carry || isPlate(chef.carry)) return 'blocked';
    if (INGREDIENTS[chef.carry].prep !== 'chop') return 'blocked';
    s.item = chef.carry;
    s.progress = 0;
    chef.carry = null;
    return 'place';
  }

  if (s.kind === 'grill') {
    if (s.item && (s.progress >= 1 || s.burnt)) {
      if (chef.carry) return 'blocked';
      chef.carry = s.burnt ? 'burnt' : COOKED_PATTY;
      s.item = null;
      s.progress = 0;
      s.burnt = false;
      return 'pickup';
    }
    if (s.item) return 'blocked'; // still cooking
    if (chef.carry !== 'patty') return 'blocked';
    s.item = 'patty';
    s.progress = 0;
    chef.carry = null;
    return 'place';
  }

  if (s.kind === 'plate') {
    if (isPlate(chef.carry)) {
      // Put the plate back down.
      state.plate = chef.carry.items;
      chef.carry = null;
      return 'place';
    }
    if (chef.carry) {
      if (state.plate.length >= 6) return 'blocked';
      state.plate.push(chef.carry);
      chef.carry = null;
      return 'place';
    }
    if (state.plate.length === 0) return 'blocked';
    chef.carry = { kind: 'plate', items: state.plate };
    state.plate = [];
    return 'pickup';
  }

  if (s.kind === 'trash') {
    if (!chef.carry) return 'blocked';
    chef.carry = null;
    return 'trash';
  }

  if (s.kind === 'pass') {
    if (!isPlate(chef.carry)) return 'blocked';
    return 'serve';
  }

  return null;
}

// Advance chopping and grilling. Chopped and cooked items wait on their
// station until the chef collects them; a patty left too long burns.
export function tickStations(state, dt) {
  for (const s of state.stations) {
    if (!s.item) continue;
    if (s.kind === 'board') {
      s.progress = Math.min(1, s.progress + dt / CHOP_SECONDS);
    } else if (s.kind === 'grill') {
      s.progress = Math.min(1, s.progress + dt / GRILL_SECONDS);
      if (s.progress >= 1) {
        // Cooked: the burn clock starts now. Only a patty left sitting
        // past the burn time is ruined.
        s.burnTime = (s.burnTime || 0) + dt;
        if (s.burnTime > BURN_SECONDS - GRILL_SECONDS) s.burnt = true;
      } else {
        s.burnTime = 0;
      }
    }
  }
}

export function resetStationTimers(state) {
  for (const s of state.stations) s.burnTime = 0;
}
