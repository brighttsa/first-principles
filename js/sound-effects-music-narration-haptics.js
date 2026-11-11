// Audio identity built from Kenney CC0 sounds (UI Audio, Interface Sounds, Steel-drum jingles, Music Loops).
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

export function sfx(name, vol = 0.55) {
  if (!state.settings.sfx || !FILES[name]) return;
  try {
    const a = audio(name).cloneNode();
    a.volume = vol;
    a.play().catch(() => {});
  } catch { /* autoplay blocked until first gesture */ }
}

export function buzz(ms = 12) {
  if (state.settings.haptics && navigator.vibrate && navigator.userActivation?.hasBeenActive !== false) navigator.vibrate(ms);
}

let music;
export function syncMusic() {
  if (!music) { music = new Audio('assets/audio/music-farm-frolics.ogg'); music.loop = true; music.volume = 0.18; }
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
