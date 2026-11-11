import { mascot } from './art-mascot-sprout-with-expressions.js';

const art = 'assets/art/world-1-growth-garden';
const route = ['seed', 'sprout', 'bloom'];

export function gardenScene(puzzle) {
  if (!puzzle.adventure) return '';
  const plants = route.map((stage) => `<img src="${art}/plant-${stage}.webp" alt="" data-plant="${stage}">`).join('');
  const bridge = puzzle.adventure === 'bridge'
    ? '<img class="wg-crossing" src="assets/art/gemini-world-1/sprite2-bridge-dry-384.webp" alt="" width="384" height="279">' : '';
  return `<div class="wg-scene" data-scene="${puzzle.adventure}" data-growth="0" aria-hidden="true">
    ${bridge}<span class="wg-plant">${plants}</span><span class="wg-sprig" data-mood="curious">${mascot('curious')}</span>
  </div>`;
}

// Sprig's reactions: each one swaps the pose and gives a small squash-and-stretch hop, then Sprig settles back to the
// resting (curious) pose so a reaction never sticks after the moment has passed. The level-complete pose stays.
const RESTING = 'curious', SETTLE_MS = 1700;
const settleTimers = new WeakMap();

export function reactInGarden(root, mood, progress, effect) {
  const scene = root.querySelector('.wg-scene');
  if (!scene) return;
  if (progress !== undefined) scene.dataset.growth = String(progress);
  if (effect) scene.dataset.effect = effect;
  const sprig = scene.querySelector('.wg-sprig');
  if (sprig.dataset.mood !== mood) { sprig.innerHTML = mascot(mood); sprig.dataset.mood = mood; }
  sprig.removeAttribute('data-react');
  void sprig.offsetWidth; // restart the hop when two reactions arrive close together
  sprig.dataset.react = mood === 'celebrating' ? 'big' : 'small';
  clearTimeout(settleTimers.get(sprig));
  if (effect === 'complete' || mood === RESTING) return;
  settleTimers.set(sprig, setTimeout(() => {
    if (!sprig.isConnected || sprig.dataset.mood !== mood) return;
    sprig.innerHTML = mascot(RESTING); sprig.dataset.mood = RESTING; sprig.removeAttribute('data-react');
  }, SETTLE_MS));
}
