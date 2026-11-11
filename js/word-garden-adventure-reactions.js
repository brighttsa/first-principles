import { mascot } from './art-mascot-sprout-with-expressions.js';

const art = 'assets/art/world-1-growth-garden';
const route = ['seed', 'sprout', 'bloom'];

export function gardenScene(puzzle) {
  if (!puzzle.adventure) return '';
  const plants = route.map((stage) => `<img src="${art}/plant-${stage}.webp" alt="" data-plant="${stage}">`).join('');
  const bridge = puzzle.adventure === 'bridge'
    ? '<img class="wg-crossing" src="assets/art/gemini-world-1/sprite2-bridge-dry-384.webp" alt="" width="384" height="279">' : '';
  return `<div class="wg-scene" data-scene="${puzzle.adventure}" data-growth="0" aria-hidden="true">
    ${bridge}<span class="wg-plant">${plants}</span><span class="wg-sprig">${mascot('curious')}</span>
  </div>`;
}

export function reactInGarden(root, mood, progress, effect) {
  const scene = root.querySelector('.wg-scene');
  if (!scene) return;
  if (progress !== undefined) scene.dataset.growth = String(progress);
  if (effect) scene.dataset.effect = effect;
  const sprig = scene.querySelector('.wg-sprig');
  sprig.innerHTML = mascot(mood);
}
