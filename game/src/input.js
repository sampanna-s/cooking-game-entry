// Sizzle Rush — keyboard and mouse. WASD or arrows walk, E (or Space)
// uses the station in reach, Q throws the carried item away, M mutes,
// P pauses, Enter starts or restarts. Clicks do the same jobs as keys:
// a station click interacts, a button click presses it.

export function createInput(canvas) {
  const input = {
    up: false,
    down: false,
    left: false,
    right: false,
    interactPressed: false,
    trashPressed: false,
    mutePressed: false,
    pausePressed: false,
    enterPressed: false,
    click: null, // { x, y } in canvas coordinates, consumed by main
    mouse: { x: 0, y: 0 },
  };

  const keymap = {
    KeyW: 'up', ArrowUp: 'up',
    KeyS: 'down', ArrowDown: 'down',
    KeyA: 'left', ArrowLeft: 'left',
    KeyD: 'right', ArrowRight: 'right',
  };

  window.addEventListener('keydown', (e) => {
    if (keymap[e.code] !== undefined) {
      input[keymap[e.code]] = true;
      e.preventDefault();
    }
    if (e.code === 'KeyE' || e.code === 'Space') {
      if (!e.repeat) input.interactPressed = true;
      e.preventDefault();
    }
    if (e.code === 'KeyQ' && !e.repeat) input.trashPressed = true;
    if (e.code === 'KeyM' && !e.repeat) input.mutePressed = true;
    if (e.code === 'KeyP' && !e.repeat) input.pausePressed = true;
    if (e.code === 'Enter' && !e.repeat) input.enterPressed = true;
  });

  window.addEventListener('keyup', (e) => {
    if (keymap[e.code] !== undefined) input[keymap[e.code]] = false;
  });

  function toCanvas(e) {
    const r = canvas.getBoundingClientRect();
    return {
      x: ((e.clientX - r.left) / r.width) * canvas.width,
      y: ((e.clientY - r.top) / r.height) * canvas.height,
    };
  }

  canvas.addEventListener('pointerdown', (e) => {
    input.click = toCanvas(e);
  });

  canvas.addEventListener('pointermove', (e) => {
    input.mouse = toCanvas(e);
  });

  return input;
}

// Edge-triggered presses are consumed once per frame.
export function consumePresses(input) {
  const out = {
    interact: input.interactPressed,
    trash: input.trashPressed,
    mute: input.mutePressed,
    pause: input.pausePressed,
    enter: input.enterPressed,
    click: input.click,
  };
  input.interactPressed = false;
  input.trashPressed = false;
  input.mutePressed = false;
  input.pausePressed = false;
  input.enterPressed = false;
  input.click = null;
  return out;
}
