// Word Garden discovery feedback: what the player sees in the half-second after submitting a word.
// Three tiers, scaled to how much the word matters:
//   micro  - bonus word: the chosen tiles pop in lavender.
//   target - a required word: the tiles pop green, a ghost of the word glides into its answer slot, the slot settles.
//   key    - the level's key word: as target, plus a spark burst on the slot.
//   miss   - an invalid word: the chosen tiles give a short wobble so the mistake is felt, not just read.
// Nothing here blocks input: effects run on classes and a detached ghost, and every timer is cleared by the returned cleanup.
import { state } from './saved-progress-and-settings-state.js';
import { sparkBurst } from './kenney-icon-and-sparkle-helpers.js';
import { sfx } from './sound-effects-music-narration-haptics.js';

const reducedMotion = () => state.settings.motion === 'on'
  || (state.settings.motion === 'auto' && matchMedia('(prefers-reduced-motion: reduce)').matches);

const TILE_CLASS = { micro: 'is-bonus', target: 'is-hit', key: 'is-hit', miss: 'is-miss' };
const TILE_MS = { micro: 260, target: 300, key: 300, miss: 260 };
const FLY_MS = 360;

export function createDiscoveryFeedback(rack) {
  const timers = new Set(), ghosts = new Set();
  const later = (fn, ms) => { const t = setTimeout(() => { timers.delete(t); fn(); }, ms); timers.add(t); };

  /** Tiles chosen for the word respond first, before the rack clears its selection state. */
  function tiles(ids, tier) {
    const cls = TILE_CLASS[tier];
    const els = ids.map((id) => rack.querySelector(`[data-letter="${id}"]`)).filter(Boolean);
    els.forEach((el, i) => {
      el.classList.remove('is-hit', 'is-bonus', 'is-miss');
      void el.offsetWidth; // restart the animation if the same tile is reused quickly
      el.style.setProperty('--wg-stagger', reducedMotion() ? '0ms' : `${i * 35}ms`);
      el.classList.add(cls);
    });
    later(() => els.forEach((el) => el.classList.remove(cls)), TILE_MS[tier] + els.length * 35);
  }

  /** A ghost of the word travels from the wheel to its slot; the slot's settle animation waits for it to land. */
  function fly(text, slot, tier) {
    const from = rack.getBoundingClientRect(), to = slot?.getBoundingClientRect();
    if (!to?.width || reducedMotion()) return; // reduced motion: the slot still turns green, just without travel
    const ghost = document.createElement('span');
    ghost.className = 'wg-fly'; ghost.textContent = text; ghost.setAttribute('aria-hidden', 'true');
    ghost.style.left = `${from.left + from.width / 2}px`; ghost.style.top = `${from.top + from.height / 2}px`;
    document.body.append(ghost); ghosts.add(ghost);
    const dx = to.left + to.width / 2 - (from.left + from.width / 2), dy = to.top + to.height / 2 - (from.top + from.height / 2);
    slot.style.setProperty('--wg-arrive', `${FLY_MS - 40}ms`);
    ghost.animate([
      { transform: 'translate(-50%, -50%) scale(.85)', opacity: 0 },
      { transform: 'translate(-50%, -50%) scale(1.12)', opacity: 1, offset: .25 },
      { transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(.9)`, opacity: .9 },
    ], { duration: FLY_MS, easing: 'cubic-bezier(.22, 1, .36, 1)', fill: 'forwards' });
    later(() => {
      ghost.remove(); ghosts.delete(ghost);
      if (tier === 'key') sparkBurst(slot, 8); else sfx('pluck', .3, 1.1); // a soft click as the word seats in its slot
    }, FLY_MS);
  }

  /** Run a follow-up once the word has landed (immediately under reduced motion); cancelled by cleanup. */
  const afterLanding = (fn) => (reducedMotion() ? fn() : later(fn, FLY_MS + 120));

  function cleanup() {
    timers.forEach(clearTimeout); timers.clear();
    ghosts.forEach((g) => g.remove()); ghosts.clear();
  }
  return { tiles, fly, afterLanding, cleanup };
}
