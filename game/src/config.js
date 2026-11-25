// Sizzle Rush — shared constants: ingredients, recipes, timings, palette.
// Every value the rest of the game reads lives here, so tuning never
// means hunting through the draw or update code.

export const VIEW_W = 1280;
export const VIEW_H = 720;

export const SHIFT_SECONDS = 150;
export const MAX_ORDERS = 4;
export const MAX_STRIKES = 3;

// Ingredient catalogue. `prep` says what the ingredient needs before it
// can go on a plate: none (grab and go), chop (chopping board) or grill.
export const INGREDIENTS = {
  bun:     { name: 'Bun',     color: '#e8b06a', dark: '#b97f3e', prep: 'none',  key: 'B' },
  patty:   { name: 'Patty',   color: '#8a5a33', dark: '#5f3a1e', prep: 'grill', key: 'P' },
  tomato:  { name: 'Tomato',  color: '#e8483f', dark: '#a92c26', prep: 'chop',  key: 'T' },
  lettuce: { name: 'Lettuce', color: '#5fbf4a', dark: '#357a28', prep: 'chop',  key: 'L' },
  cheese:  { name: 'Cheese',  color: '#f7c948', dark: '#c79a1d', prep: 'none',  key: 'C' },
  onion:   { name: 'Onion',   color: '#c9a0dc', dark: '#8a5fa8', prep: 'chop',  key: 'O' },
};

// A cooked patty is its own item once it leaves the grill.
export const COOKED_PATTY = 'cookedPatty';

// Recipes: the dishes the order board asks for. `needs` lists the
// finished items a plate must hold (order does not matter).
export const RECIPES = [
  {
    id: 'classic',
    name: 'Classic Burger',
    needs: ['bun', 'cookedPatty', 'tomato', 'lettuce'],
    base: 20,
  },
  {
    id: 'melt',
    name: 'Cheese Melt',
    needs: ['bun', 'cookedPatty', 'cheese'],
    base: 18,
  },
  {
    id: 'garden',
    name: 'Garden Stack',
    needs: ['bun', 'tomato', 'lettuce', 'onion'],
    base: 16,
  },
  {
    id: 'double',
    name: 'Double Trouble',
    needs: ['bun', 'cookedPatty', 'cookedPatty', 'cheese', 'tomato'],
    base: 30,
  },
  {
    id: 'crunch',
    name: 'Crunch Stack',
    needs: ['bun', 'lettuce', 'onion', 'cheese'],
    base: 16,
  },
];

export const CHOP_SECONDS = 2.0;
export const GRILL_SECONDS = 4.0;
export const BURN_SECONDS = 9.0;
export const ORDER_PATIENCE = 48; // seconds before a ticket expires
export const ORDER_FIRST_DELAY = 6; // first ticket appears after 6s
export const ORDER_INTERVAL = 13; // seconds between new tickets (shrinks)
export const ORDER_INTERVAL_MIN = 7;
export const RUSH_AT = 30; // last 30 seconds are the dinner rush

export const CHEF_SPEED = 300; // pixels per second
export const CHEF_RADIUS = 22;

export const PALETTE = {
  wall: '#f2c14e',
  wallDark: '#d9a83b',
  floor: '#f7e8c9',
  floorTile: '#efdcb2',
  counter: '#c98d5a',
  counterTop: '#e0aa72',
  steel: '#b9c4cc',
  steelDark: '#8d9aa5',
  board: '#fdf6e3',
  boardEdge: '#d8c49a',
  ink: '#3a2c1c',
  inkSoft: '#6b543a',
  red: '#e8483f',
  green: '#4da53a',
  gold: '#f7c948',
  cream: '#fff8e7',
};
