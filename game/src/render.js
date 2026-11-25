// Sizzle Rush — everything the player sees, drawn on one canvas:
// the HUD, the order board, the kitchen, the chef and the screens.
// All art is drawn shapes: no image files, no fonts to load.

import { VIEW_W, VIEW_H, PALETTE, INGREDIENTS, COOKED_PATTY } from './config.js';

const FONT = 'system-ui, "Segoe UI", sans-serif';

function rr(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function text(ctx, s, x, y, size, color, weight = 700, align = 'left') {
  ctx.fillStyle = color;
  ctx.font = `${weight} ${size}px ${FONT}`;
  ctx.textAlign = align;
  ctx.textBaseline = 'middle';
  ctx.fillText(s, x, y);
}

// --- ingredient icons -------------------------------------------------

export function drawIngredientIcon(ctx, id, x, y, size) {
  const s = size;
  ctx.save();
  ctx.translate(x, y);
  if (id === 'bun') {
    ctx.fillStyle = '#e8b06a';
    ctx.beginPath();
    ctx.arc(0, s * 0.08, s * 0.42, Math.PI, 0);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#d89a52';
    ctx.fillRect(-s * 0.42, s * 0.06, s * 0.84, s * 0.16);
    ctx.fillStyle = '#fff2cf';
    for (const [dx, dy] of [[-0.2, -0.18], [0.05, -0.28], [0.24, -0.12]]) {
      ctx.beginPath();
      ctx.ellipse(dx * s, dy * s, s * 0.05, s * 0.03, 0.4, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (id === 'patty') {
    ctx.fillStyle = '#8a5a33';
    rr(ctx, -s * 0.44, -s * 0.16, s * 0.88, s * 0.32, s * 0.14);
    ctx.fill();
    ctx.fillStyle = '#6d4423';
    for (const dx of [-0.25, 0, 0.25]) {
      ctx.beginPath();
      ctx.arc(dx * s, 0, s * 0.05, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (id === COOKED_PATTY) {
    ctx.fillStyle = '#5f3a1e';
    rr(ctx, -s * 0.44, -s * 0.16, s * 0.88, s * 0.32, s * 0.14);
    ctx.fill();
    ctx.strokeStyle = '#3d2410';
    ctx.lineWidth = s * 0.05;
    for (const dx of [-0.22, 0, 0.22]) {
      ctx.beginPath();
      ctx.moveTo((dx - 0.08) * s, -s * 0.14);
      ctx.lineTo((dx + 0.08) * s, s * 0.14);
      ctx.stroke();
    }
  } else if (id === 'tomato') {
    ctx.fillStyle = '#e8483f';
    ctx.beginPath();
    ctx.arc(0, s * 0.05, s * 0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#7ec850';
    ctx.beginPath();
    ctx.moveTo(0, -s * 0.28);
    ctx.lineTo(-s * 0.16, -s * 0.05);
    ctx.lineTo(0, -s * 0.14);
    ctx.lineTo(s * 0.16, -s * 0.05);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#f2a49e';
    ctx.beginPath();
    ctx.ellipse(-s * 0.16, -s * 0.08, s * 0.1, s * 0.16, -0.5, 0, Math.PI * 2);
    ctx.fill();
  } else if (id === 'lettuce') {
    ctx.fillStyle = '#5fbf4a';
    for (const [dx, dy, r] of [[-0.2, 0.08, 0.24], [0.18, 0.1, 0.26], [0, -0.14, 0.26]]) {
      ctx.beginPath();
      ctx.arc(dx * s, dy * s, r * s, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.strokeStyle = '#357a28';
    ctx.lineWidth = s * 0.04;
    ctx.beginPath();
    ctx.moveTo(-s * 0.3, s * 0.1);
    ctx.quadraticCurveTo(0, -s * 0.2, s * 0.3, s * 0.08);
    ctx.stroke();
  } else if (id === 'cheese') {
    ctx.fillStyle = '#f7c948';
    ctx.beginPath();
    ctx.moveTo(-s * 0.42, s * 0.3);
    ctx.lineTo(s * 0.42, s * 0.3);
    ctx.lineTo(0, -s * 0.32);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#d9a521';
    for (const [dx, dy] of [[-0.12, 0.12], [0.14, 0.05], [-0.02, -0.12]]) {
      ctx.beginPath();
      ctx.arc(dx * s, dy * s, s * 0.06, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (id === 'onion') {
    ctx.fillStyle = '#efe6f7';
    ctx.beginPath();
    ctx.arc(0, s * 0.06, s * 0.38, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#b48ecf';
    ctx.lineWidth = s * 0.05;
    for (const r of [0.28, 0.17]) {
      ctx.beginPath();
      ctx.arc(0, s * 0.06, r * s, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.fillStyle = '#7ec850';
    ctx.beginPath();
    ctx.moveTo(0, -s * 0.32);
    ctx.quadraticCurveTo(s * 0.1, -s * 0.48, 0, -s * 0.52);
    ctx.quadraticCurveTo(-s * 0.1, -s * 0.48, 0, -s * 0.32);
    ctx.fill();
  } else if (id === 'burnt') {
    ctx.fillStyle = '#26211c';
    ctx.beginPath();
    ctx.arc(-s * 0.12, s * 0.05, s * 0.3, 0, Math.PI * 2);
    ctx.arc(s * 0.16, s * 0.08, s * 0.26, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#5a5148';
    ctx.beginPath();
    ctx.arc(-s * 0.18, -s * 0.08, s * 0.07, 0, Math.PI * 2);
    ctx.arc(s * 0.1, -s * 0.02, s * 0.06, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

// A plate with its stacked ingredients, drawn from above.
export function drawPlate(ctx, items, x, y, size) {
  const r = size / 2;
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = '#e8e2d5';
  ctx.beginPath();
  ctx.ellipse(0, 0, r, r * 0.82, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#c9bfa5';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(0, 0, r * 0.72, r * 0.58, 0, 0, Math.PI * 2);
  ctx.stroke();
  if (items.length === 0) {
    ctx.fillStyle = '#b0a488';
    ctx.font = `600 ${Math.round(size * 0.16)}px ${FONT}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('empty plate', 0, 1);
  } else {
    const n = items.length;
    items.forEach((id, i) => {
      const dy = (i - (n - 1) / 2) * size * 0.1;
      drawIngredientIcon(ctx, id, 0, dy, size * 0.52);
    });
  }
  ctx.restore();
}

// --- kitchen -----------------------------------------------------------

function drawFloor(ctx) {
  ctx.fillStyle = PALETTE.floor;
  ctx.fillRect(0, 150, VIEW_W, VIEW_H - 150);
  ctx.fillStyle = PALETTE.floorTile;
  const tile = 64;
  for (let y = 150; y < VIEW_H; y += tile) {
    for (let x = ((y / tile) % 2) * tile / 2; x < VIEW_W; x += tile) {
      ctx.fillRect(x, y, tile - 2, tile - 2);
    }
  }
  // Wall band above the floor.
  ctx.fillStyle = PALETTE.wall;
  ctx.fillRect(0, 58, VIEW_W, 92);
  ctx.fillStyle = PALETTE.wallDark;
  ctx.fillRect(0, 142, VIEW_W, 8);
}

function drawStation(ctx, s, state, highlight) {
  const { x, y, w, h } = s;
  ctx.save();
  if (highlight) {
    ctx.shadowColor = '#ffdf6b';
    ctx.shadowBlur = 18;
  }
  if (s.kind === 'bin') {
    ctx.fillStyle = PALETTE.counter;
    rr(ctx, x, y, w, h, 10);
    ctx.fill();
    ctx.fillStyle = PALETTE.counterTop;
    rr(ctx, x + 4, y + 4, w - 8, h - 22, 8);
    ctx.fill();
    const id = s.id.slice(4);
    drawIngredientIcon(ctx, id, x + 34, y + 26, 34);
    text(ctx, INGREDIENTS[id].name.toUpperCase(), x + 58, y + 20, 15, '#fff');
    text(ctx, INGREDIENTS[id].prep === 'none' ? 'grab & go' : 'needs ' + INGREDIENTS[id].prep, x + 58, y + 40, 11, '#ffe9c4', 600);
    text(ctx, 'E', x + w - 14, y + 46, 12, '#fff8e7', 800, 'right');
  } else if (s.kind === 'board') {
    ctx.fillStyle = '#a9805a';
    rr(ctx, x, y + 10, w, h - 10, 10);
    ctx.fill();
    ctx.fillStyle = '#e8c99a';
    rr(ctx, x + 8, y, w - 16, h - 16, 8);
    ctx.fill();
    text(ctx, 'CHOPPING BOARD', x + w / 2, y + 16, 13, '#7a5a34', 800, 'center');
    if (s.item) {
      drawIngredientIcon(ctx, s.item, x + w / 2, y + 52, 44);
      if (s.progress < 1) {
        ctx.strokeStyle = '#7a5a34';
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.arc(x + w / 2, y + 52, 30, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * s.progress);
        ctx.stroke();
      } else {
        text(ctx, 'READY!', x + w / 2, y + 82, 12, '#2e7d32', 800, 'center');
      }
    } else {
      text(ctx, 'tomato · lettuce · onion', x + w / 2, y + 52, 13, '#a3805c', 600, 'center');
    }
  } else if (s.kind === 'grill') {
    ctx.fillStyle = '#4a4a52';
    rr(ctx, x, y, w, h, 10);
    ctx.fill();
    ctx.fillStyle = '#2c2c31';
    rr(ctx, x + 10, y + 10, w - 20, h - 26, 8);
    ctx.fill();
    ctx.strokeStyle = '#5d5d66';
    ctx.lineWidth = 4;
    for (let i = 1; i < 6; i++) {
      ctx.beginPath();
      ctx.moveTo(x + 14 + (i * (w - 28)) / 6, y + 14);
      ctx.lineTo(x + 14 + (i * (w - 28)) / 6, y + h - 20);
      ctx.stroke();
    }
    text(ctx, 'GRILL', x + w / 2, y + h - 6, 12, '#9a9aa5', 800, 'center');
    if (s.item) {
      const cx = x + w / 2;
      const cy = y + (h - 16) / 2;
      drawIngredientIcon(ctx, s.burnt ? 'burnt' : s.progress >= 1 ? COOKED_PATTY : 'patty', cx, cy, 52);
      if (s.progress < 1) {
        ctx.fillStyle = '#ffdf6b';
        rr(ctx, cx - 46, cy + 30, 92 * s.progress, 7, 3);
        ctx.fill();
      } else if (s.burnt) {
        text(ctx, 'BURNT!', x + 16, cy, 13, '#ff6b5e', 800, 'left');
      } else {
        text(ctx, 'COOKED!', x + 16, cy, 13, '#8dff7a', 800, 'left');
      }
    }
  } else if (s.kind === 'plate') {
    ctx.fillStyle = PALETTE.steel;
    rr(ctx, x, y, w, h, 10);
    ctx.fill();
    ctx.fillStyle = PALETTE.steelDark;
    rr(ctx, x + 6, y + 6, w - 12, h - 12, 8);
    ctx.fill();
    text(ctx, 'PLATING', x + w / 2, y + 16, 13, '#e8eef2', 800, 'center');
    drawPlate(ctx, state.plate, x + w / 2, y + 56, 62);
  } else if (s.kind === 'trash') {
    ctx.fillStyle = '#7a6a58';
    rr(ctx, x, y, w, h, 10);
    ctx.fill();
    ctx.fillStyle = '#5d5044';
    rr(ctx, x + 8, y + 8, w - 16, h - 24, 8);
    ctx.fill();
    text(ctx, 'TRASH', x + w / 2, y + h - 10, 13, '#d8cbb8', 800, 'center');
  } else if (s.kind === 'pass') {
    ctx.fillStyle = '#b3563f';
    rr(ctx, x, y, w, h, 10);
    ctx.fill();
    ctx.fillStyle = '#d97b5f';
    rr(ctx, x + 6, y + 6, w - 12, h - 12, 8);
    ctx.fill();
    text(ctx, 'SERVING PASS', x + w / 2, y + 16, 13, '#fff', 800, 'center');
    if (state.readyPlate) {
      drawPlate(ctx, state.readyPlate, x + w / 2, y + 44, 54);
      text(ctx, 'READY!', x + w / 2, y + h - 8, 12, '#ffe9c4', 800, 'center');
    } else {
      text(ctx, 'serve plates here', x + w / 2, y + 66, 12, '#ffe0d6', 600, 'center');
    }
  }
  ctx.restore();
}

// --- HUD and order board ------------------------------------------------

function fmtTime(sec) {
  const s = Math.max(0, Math.ceil(sec));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

function drawHud(ctx, state) {
  ctx.fillStyle = '#2e2118';
  ctx.fillRect(0, 0, VIEW_W, 58);
  text(ctx, '🍳 SIZZLE RUSH', 16, 30, 26, '#ffdf6b', 800);
  // Timer.
  const t = state.timeLeft;
  const low = t <= 30;
  text(ctx, '⏱ ' + fmtTime(t), 300, 30, 28, low ? '#ff6b5e' : '#fff', 800);
  ctx.fillStyle = '#4a3a28';
  rr(ctx, 420, 18, 220, 22, 11);
  ctx.fill();
  ctx.fillStyle = low ? '#ff6b5e' : '#5fbf4a';
  rr(ctx, 420, 18, 220 * Math.max(0, t / 150), 22, 11);
  ctx.fill();
  if (state.rush) text(ctx, 'DINNER RUSH!', 656, 30, 18, '#ff9d5c', 800);
  text(ctx, `💰 ${state.coins}`, 880, 30, 24, '#fff', 800);
  text(ctx, `🍽 ${state.served} served`, 1000, 30, 20, '#ffe9c4', 700);
  if (state.combo >= 2) {
    text(ctx, `COMBO ×${state.combo}`, 1264, 30, 18, '#ffdf6b', 800, 'right');
  }
  // Reputation hearts.
  for (let i = 0; i < state.maxStrikes; i++) {
    const x = 800 + i * 28;
    ctx.font = '22px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(i < state.maxStrikes - state.strikes ? '❤️' : '🖤', x, 29);
  }
}

function drawOrderBoard(ctx, state) {
  ctx.fillStyle = PALETTE.board;
  rr(ctx, 16, 64, VIEW_W - 32, 86, 12);
  ctx.fill();
  ctx.strokeStyle = PALETTE.boardEdge;
  ctx.lineWidth = 3;
  rr(ctx, 16, 64, VIEW_W - 32, 86, 12);
  ctx.stroke();
  text(ctx, 'ORDERS', 32, 108, 16, PALETTE.inkSoft, 800);
  if (state.orders.length === 0) {
    text(ctx, 'No orders yet — first ticket lands in a few seconds…', 120, 108, 16, '#a3805c', 600);
    return;
  }
  state.orders.forEach((o, i) => {
    const x = 120 + i * 290;
    const y = 72;
    const w = 276;
    const h = 70;
    const frac = Math.max(0, o.patience / o.maxPatience);
    const urgent = frac < 0.35;
    ctx.save();
    if (urgent && Math.floor(state.elapsed * 4) % 2 === 0) {
      ctx.shadowColor = '#ff6b5e';
      ctx.shadowBlur = 12;
    }
    ctx.fillStyle = '#fffdf6';
    rr(ctx, x, y, w, h, 8);
    ctx.fill();
    ctx.restore();
    ctx.strokeStyle = urgent ? '#e8483f' : '#d8c49a';
    ctx.lineWidth = 2;
    rr(ctx, x, y, w, h, 8);
    ctx.stroke();
    text(ctx, `#${o.id} ${o.recipe.name}`, x + 10, y + 14, 15, PALETTE.ink, 800);
    o.recipe.needs.forEach((id, j) => {
      drawIngredientIcon(ctx, id, x + 24 + j * 34, y + 40, 26);
    });
    // Patience bar.
    ctx.fillStyle = '#e8dcc2';
    rr(ctx, x + 10, y + h - 12, w - 20, 7, 3);
    ctx.fill();
    ctx.fillStyle = urgent ? '#e8483f' : frac < 0.6 ? '#f7a948' : '#5fbf4a';
    rr(ctx, x + 10, y + h - 12, (w - 20) * frac, 7, 3);
    ctx.fill();
  });
}

// --- chef ---------------------------------------------------------------

function drawChef(ctx, state) {
  const c = state.chef;
  const bob = c.moving ? Math.sin(c.bob) * 2 : 0;
  ctx.save();
  ctx.translate(c.x, c.y + bob);
  if (state.shake > 0) ctx.translate((Math.random() - 0.5) * 4, (Math.random() - 0.5) * 4);
  // Shadow.
  ctx.fillStyle = 'rgba(0,0,0,0.18)';
  ctx.beginPath();
  ctx.ellipse(0, 26, 24, 8, 0, 0, Math.PI * 2);
  ctx.fill();
  // Body and apron.
  ctx.fillStyle = '#fff';
  rr(ctx, -18, -6, 36, 34, 12);
  ctx.fill();
  ctx.fillStyle = '#4da3d8';
  rr(ctx, -14, 6, 28, 22, 8);
  ctx.fill();
  // Head.
  ctx.fillStyle = '#f2c89b';
  ctx.beginPath();
  ctx.arc(0, -18, 15, 0, Math.PI * 2);
  ctx.fill();
  // Chef hat.
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(-8, -30, 9, 0, Math.PI * 2);
  ctx.arc(0, -34, 10, 0, Math.PI * 2);
  ctx.arc(8, -30, 9, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillRect(-14, -32, 28, 6);
  // Eyes look in the facing direction.
  ctx.fillStyle = '#26211c';
  ctx.beginPath();
  ctx.arc(4 * c.dir, -18, 2.2, 0, Math.PI * 2);
  ctx.arc(11 * c.dir, -18, 2.2, 0, Math.PI * 2);
  ctx.fill();
  // Carried item floats above the hat.
  if (c.carry) {
    if (typeof c.carry === 'object') {
      drawPlate(ctx, c.carry.items, 0, -58, 44);
    } else {
      drawIngredientIcon(ctx, c.carry, 0, -56, 34);
    }
  }
  ctx.restore();
}

// --- floaters, particles, screens ---------------------------------------

function drawFloaters(ctx, state) {
  for (const f of state.floaters) {
    const a = Math.max(0, f.life / f.maxLife);
    ctx.globalAlpha = a;
    text(ctx, f.text, f.x, f.y, 24, f.color, 800, 'center');
    ctx.globalAlpha = 1;
  }
}

function drawParticles(ctx, state) {
  for (const p of state.particles) {
    ctx.globalAlpha = Math.max(0, p.life / p.maxLife);
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

function drawTitle(ctx, state) {
  ctx.fillStyle = 'rgba(46,33,24,0.72)';
  ctx.fillRect(0, 0, VIEW_W, VIEW_H);
  ctx.fillStyle = PALETTE.cream;
  rr(ctx, 290, 110, 700, 470, 20);
  ctx.fill();
  ctx.strokeStyle = '#e8b06a';
  ctx.lineWidth = 4;
  rr(ctx, 290, 110, 700, 470, 20);
  ctx.stroke();
  text(ctx, '🍳 SIZZLE RUSH', 640, 170, 52, '#c25e2e', 800, 'center');
  text(ctx, 'A tiny kitchen-chaos cooking game', 640, 214, 20, PALETTE.inkSoft, 600, 'center');
  const lines = [
    ['WASD / arrows', 'run around the kitchen'],
    ['E or click', 'pick up, place, chop, grill, plate & serve'],
    ['Q', 'throw the carried item in the trash'],
    ['P', 'pause      M  mute'],
  ];
  lines.forEach(([k, v], i) => {
    text(ctx, k, 400, 268 + i * 34, 18, '#c25e2e', 800);
    text(ctx, v, 640, 268 + i * 34, 18, PALETTE.ink, 600);
  });
  text(ctx, 'Fill every ticket before its patience runs out.', 640, 420, 18, PALETTE.ink, 700, 'center');
  text(ctx, 'Burn a patty and it goes in the trash. Three expired', 640, 446, 18, PALETTE.ink, 700, 'center');
  text(ctx, 'tickets end the shift early. Survive 2:30!', 640, 472, 18, PALETTE.ink, 700, 'center');
  ctx.fillStyle = '#c25e2e';
  rr(ctx, 490, 500, 300, 56, 12);
  ctx.fill();
  text(ctx, 'START SHIFT  ▶', 640, 529, 24, '#fff', 800, 'center');
  text(ctx, 'or press Enter', 640, 566, 14, PALETTE.inkSoft, 600, 'center');
}

function drawSummary(ctx, state) {
  const s = state.summary;
  ctx.fillStyle = 'rgba(46,33,24,0.72)';
  ctx.fillRect(0, 0, VIEW_W, VIEW_H);
  ctx.fillStyle = PALETTE.cream;
  rr(ctx, 340, 130, 600, 430, 20);
  ctx.fill();
  ctx.strokeStyle = '#e8b06a';
  ctx.lineWidth = 4;
  rr(ctx, 340, 130, 600, 430, 20);
  ctx.stroke();
  text(ctx, s.title, 640, 190, 44, '#c25e2e', 800, 'center');
  text(ctx, s.subtitle, 640, 232, 18, PALETTE.inkSoft, 600, 'center');
  const rows = [
    ['Dishes served', String(s.served)],
    ['Coins earned', '💰 ' + s.coins],
    ['Best combo', '×' + s.bestCombo],
    ['Tickets expired', String(s.expired)],
  ];
  rows.forEach(([k, v], i) => {
    text(ctx, k, 430, 292 + i * 36, 20, PALETTE.ink, 600);
    text(ctx, v, 850, 292 + i * 36, 20, PALETTE.ink, 800, 'right');
  });
  const stars = '★'.repeat(s.stars) + '☆'.repeat(3 - s.stars);
  text(ctx, stars, 640, 462, 40, '#f7a948', 800, 'center');
  ctx.fillStyle = '#c25e2e';
  rr(ctx, 490, 492, 300, 52, 12);
  ctx.fill();
  text(ctx, 'PLAY AGAIN  ▶', 640, 519, 22, '#fff', 800, 'center');
}

// --- main render ----------------------------------------------------------

export function render(ctx, state, nearStation) {
  ctx.clearRect(0, 0, VIEW_W, VIEW_H);
  drawFloor(ctx);
  drawOrderBoard(ctx, state);
  for (const s of state.stations) {
    drawStation(ctx, s, state, nearStation === s);
  }
  if (nearStation) {
    text(ctx, nearStation.label + '  —  press E', nearStation.x + nearStation.w / 2, nearStation.y - 12, 13, '#7a5a34', 700, 'center');
  }
  drawParticles(ctx, state);
  drawChef(ctx, state);
  drawFloaters(ctx, state);
  drawHud(ctx, state);
  if (state.screen === 'title') drawTitle(ctx, state);
  if (state.screen === 'summary') drawSummary(ctx, state);
  if (state.paused && !state.frozen && state.screen === 'play') {
    ctx.fillStyle = 'rgba(46,33,24,0.6)';
    ctx.fillRect(0, 0, VIEW_W, VIEW_H);
    text(ctx, 'PAUSED — press P to keep cooking', 640, 360, 30, '#fff', 800, 'center');
  }
}
