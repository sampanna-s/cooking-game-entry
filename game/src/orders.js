// Sizzle Rush — the order board: tickets arrive, wait, and either get
// served for coins or expire and cost the kitchen a strike.

import {
  RECIPES,
  ORDER_PATIENCE,
  ORDER_FIRST_DELAY,
  ORDER_INTERVAL,
  ORDER_INTERVAL_MIN,
  RUSH_AT,
  MAX_ORDERS,
} from './config.js';

function pickRecipe(state, rand) {
  // The Double Trouble only shows up once the shift is under way.
  const pool = RECIPES.filter((r) => r.id !== 'double' || state.elapsed > 60);
  return pool[Math.floor(rand() * pool.length)];
}

export function spawnOrder(state, rand) {
  if (state.orders.length >= MAX_ORDERS) return null;
  const recipe = pickRecipe(state, rand);
  const order = {
    id: state.nextOrderId,
    recipe,
    patience: ORDER_PATIENCE,
    maxPatience: ORDER_PATIENCE,
  };
  state.nextOrderId += 1;
  state.orders.push(order);
  return order;
}

// Tick the order clock: new tickets on a shrinking interval, patience
// draining on the ones already up. Returns the orders that expired.
export function tickOrders(state, dt, rand) {
  const expired = [];
  const interval = Math.max(
    ORDER_INTERVAL_MIN,
    ORDER_INTERVAL - Math.floor(state.elapsed / 30),
  );
  state.orderTimer += dt;
  const firstAt = state.orders.length === 0 && state.nextOrderId === 1
    ? ORDER_FIRST_DELAY
    : interval;
  if (state.orderTimer >= firstAt) {
    state.orderTimer = 0;
    spawnOrder(state, rand);
  }
  for (const o of state.orders) o.patience -= dt;
  state.orders = state.orders.filter((o) => {
    if (o.patience <= 0) {
      expired.push(o);
      return false;
    }
    return true;
  });
  return expired;
}

// Does a plate hold exactly what a recipe needs? Counts match, so two
// patties are two patties and order never matters.
export function plateMatches(recipe, items) {
  const need = {};
  for (const n of recipe.needs) need[n] = (need[n] || 0) + 1;
  const have = {};
  for (const n of items) have[n] = (have[n] || 0) + 1;
  const keys = new Set([...Object.keys(need), ...Object.keys(have)]);
  for (const k of keys) {
    if ((need[k] || 0) !== (have[k] || 0)) return false;
  }
  return true;
}

// Serve a plate at the pass. Finds the first ticket the plate satisfies
// and pays base + a tip for the patience left, times the combo.
// Returns { order, coins } or null when no ticket wants this plate.
export function servePlate(state, items) {
  const idx = state.orders.findIndex((o) => plateMatches(o.recipe, items));
  if (idx === -1) return null;
  const order = state.orders[idx];
  state.orders.splice(idx, 1);
  const patienceFrac = Math.max(0, order.patience / order.maxPatience);
  const tip = Math.round(20 * patienceFrac);
  state.combo += 1;
  state.bestCombo = Math.max(state.bestCombo, state.combo);
  const mult = Math.min(2, 1 + 0.25 * (state.combo - 1));
  const coins = Math.round((order.recipe.base + tip) * mult);
  state.coins += coins;
  state.score += coins;
  state.served += 1;
  return { order, coins, mult };
}

// An expired ticket breaks the combo and costs a strike.
export function applyExpiry(state) {
  state.combo = 0;
  state.strikes += 1;
}

export function isRush(state) {
  return state.timeLeft <= RUSH_AT;
}
