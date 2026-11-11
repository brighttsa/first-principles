// World 2 map: a windswept hilltop. The journey starts calm; as each lesson is done the completed painting is revealed around its
// landmark (kites fly, the windmill turns, the bell tower lantern lights, the gate opens). See unified-plate-scene-builder-for-world-maps.js.
import { createUnifiedPlateScene } from './unified-plate-scene-builder-for-world-maps.js';

// Ambient life: light shafts and drifting motes only. The kites, windmill and lantern are already painted into the completed plate.
const MOTES = [[10, 78, 0], [30, 64, 3], [50, 86, 6], [66, 70, 9], [80, 90, 2], [90, 58, 5]];
const ambient = () => `<div class="wa-ambient"><span class="wa-rays"></span>
  ${MOTES.map(([x, y, d]) => `<i class="wa-mote" style="--x:${x}%;--y:${y}%;--d:-${d}s"></i>`).join('')}</div>`;

const world2Plates = createUnifiedPlateScene({
  ambient,
  dir: 'assets/art/world-2-plates',
  // Lesson order: gate (Jesus in us), bench ring (fellowship), kite pole (seven Spirits), bell tower (tongues), windmill (review).
  landmarks: ['gate', 'benches', 'kites', 'bell', 'windmill'],
  reveals: {
    // The gate ellipse stays on the left of the path so the second gate Gemini added on the right of the completed portrait plate is never shown.
    gate: [[24, 73, 12, 9], [17, 40, 10, 28]],
    benches: [[78, 61, 14, 8], [33, 56, 8, 10]],
    kites: [[27, 27, 24, 26], [57, 30, 15, 28]],
    bell: [[82, 40, 11, 10], [92, 50, 8, 12]],
    windmill: [[72, 19, 16, 12], [87, 18, 9, 15]],
  },
});

export const worldTwoUnifiedScene = world2Plates.scene;
export const worldTwoHeroScene = world2Plates.hero;
