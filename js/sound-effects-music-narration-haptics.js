// Audio identity built from Kenney CC0 sounds (Interface Sounds, Steel-drum jingles) plus the owner's soundtrack.
// Music, effects, narration and haptics are independently switchable.
import { state } from './saved-progress-and-settings-state.js';

const FILES = {
  tap: 'select_001', lift: 'tick_001', place: 'drop_001', unplace: 'drop_003', ok: 'confirmation_001',
  good: 'confirmation_003', oops: 'error_003', page: 'open_001', back: 'back_001', close: 'close_001',
  pluck: 'pluck_001', pluck2: 'pluck_002', toggle: 'toggle_001', ask: 'question_001', scroll: 'scroll_001',
  found: 'jingle-word-found', solved: 'jingle-puzzle-solved', chapter: 'jingle-chapter-complete',
};
const cache = {};

function audio(name) {
  if (!cache[name]) { cache[name] = new Audio(`assets/audio/${FILES[name]}.ogg`); cache[name].preload = 'auto'; }
  return cache[name];
}

/** `rate` above 1 raises the pitch (used to make letters climb as a word is built). */
export function sfx(name, vol = 0.55, rate = 1) {
  if (!state.settings.sfx || !FILES[name]) return;
  try {
    const a = audio(name).cloneNode();
    a.volume = vol;
    if (rate !== 1) { a.preservesPitch = false; a.playbackRate = rate; }
    a.play().catch(() => {});
  } catch { /* autoplay blocked until first gesture */ }
}

/** A duration in ms, or a pattern such as [8, 50, 8] for a double tap. */
export function buzz(ms = 12) {
  if (state.settings.haptics && navigator.vibrate && navigator.userActivation?.hasBeenActive !== false) navigator.vibrate(ms);
}

let music;
export function syncMusic() {
  // Soundtrack: "Family Adventure", supplied by the project owner (made with Suno). Loops quietly under play.
  if (!music) { music = new Audio('assets/audio/music-family-adventure.mp3'); music.loop = true; music.volume = 0.18; }
  if (state.settings.music) music.play().catch(() => {}); else music.pause();
}

/** Optional narration through the browser's speech engine (no network, no recording needed). */
export function speak(text, force = false) {
  if (!('speechSynthesis' in window) || (!state.settings.narration && !force)) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.rate = state.level === 'child' ? 0.85 : 0.95;
  speechSynthesis.speak(u);
}
export const stopSpeaking = () => 'speechSynthesis' in window && speechSynthesis.cancel();
