// Sizzle Rush — every sound is synthesized with WebAudio: short blips
// and sweeps, no audio files at all. The context is created lazily on
// the first user gesture so browsers never block it.

export function createAudio() {
  return { ctx: null, muted: false };
}

function ctxOf(audio) {
  if (!audio.ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    audio.ctx = new AC();
  }
  if (audio.ctx.state === 'suspended') audio.ctx.resume();
  return audio.ctx;
}

function blip(audio, freq, dur, type, vol, when = 0) {
  if (audio.muted) return;
  const ctx = ctxOf(audio);
  if (!ctx) return;
  const t = ctx.currentTime + when;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  gain.gain.setValueAtTime(vol, t);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(t);
  osc.stop(t + dur + 0.02);
}

// One named sound per game event. Keep them short: the kitchen is busy
// enough without a jingle every second.
export function playSound(audio, name) {
  if (audio.muted) return;
  switch (name) {
    case 'pickup':
      blip(audio, 520, 0.07, 'triangle', 0.12);
      break;
    case 'place':
      blip(audio, 340, 0.08, 'triangle', 0.12);
      break;
    case 'chop':
      blip(audio, 180, 0.05, 'square', 0.08);
      blip(audio, 140, 0.05, 'square', 0.08, 0.07);
      break;
    case 'ready':
      blip(audio, 660, 0.09, 'sine', 0.12);
      blip(audio, 880, 0.12, 'sine', 0.12, 0.09);
      break;
    case 'serve':
      blip(audio, 523, 0.1, 'triangle', 0.14);
      blip(audio, 659, 0.1, 'triangle', 0.14, 0.09);
      blip(audio, 784, 0.16, 'triangle', 0.14, 0.18);
      break;
    case 'bad':
      blip(audio, 220, 0.15, 'sawtooth', 0.08);
      blip(audio, 165, 0.2, 'sawtooth', 0.08, 0.12);
      break;
    case 'tick':
      blip(audio, 980, 0.04, 'square', 0.05);
      break;
    case 'start':
      blip(audio, 392, 0.1, 'triangle', 0.12);
      blip(audio, 523, 0.14, 'triangle', 0.12, 0.1);
      break;
    default:
      break;
  }
}

export function toggleMute(audio) {
  audio.muted = !audio.muted;
  return audio.muted;
}
