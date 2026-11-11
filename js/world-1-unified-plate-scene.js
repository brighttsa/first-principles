// World 1 map: the journey as it starts, with the completed painting revealed around each landmark as its lesson is done
// (doorway glows, garden blooms, lantern lights, Bible opens). See unified-plate-scene-builder-for-world-maps.js.
import { createUnifiedPlateScene } from './unified-plate-scene-builder-for-world-maps.js';

// Ambient life over the painting: light shafts, drifting motes, shimmer on the stream, and the lantern flame once it is lit.
// Pure CSS motion (css/world-1-ambient-life.css); the map's pause control and reduced-motion setting stop it.
const MOTES = [[12, 80, 0], [28, 66, 3], [47, 84, 6], [63, 72, 9], [78, 88, 2], [88, 60, 5], [36, 92, 8]];
const GLINTS = [[0, 1], [1, 2], [2, 3], [3, 4]]; // index into the per-layout stream points in CSS (--g1..--g4)
const ambient = (states) => `<div class="wa-ambient"><span class="wa-rays"></span>
  ${MOTES.map(([x, y, d]) => `<i class="wa-mote" style="--x:${x}%;--y:${y}%;--d:-${d}s"></i>`).join('')}
  ${GLINTS.map(([, n]) => `<i class="wa-glint" data-g="${n}"></i>`).join('')}
  ${states[3] === 'done' ? '<i class="wa-lantern"></i>' : ''}</div>`;

const world1Plates = createUnifiedPlateScene({
  ambient,
  dir: 'assets/art/world-1-plates',
  landmarks: ['doorway', 'bridge', 'garden', 'lantern', 'review'],
  reveals: {
    doorway: [[74, 17, 15, 11], [12, 34, 9, 18]],
    bridge: [[0, 0, 0, 0], [0, 0, 0, 0]], // painted the same in both states, nothing to reveal
    garden: [[34, 51, 17, 9], [54, 62, 10, 10]],
    lantern: [[70, 67, 11, 12], [69, 33, 7, 16]],
    review: [[36, 85, 15, 11], [91, 55, 9, 14]],
  },
});

/** states = [lesson1..lesson4, review] as 'done' | 'cur' | 'lock'. Returns the art slot and the planes for the renderer. */
export const worldOneUnifiedScene = world1Plates.scene;

/** Calm backdrop for the welcome, chapter introduction and chapter complete screens. */
export const worldOneHeroScene = world1Plates.hero;
