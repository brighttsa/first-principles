// World registry: which worlds have playable content, which one is active, and the saved-progress keys each world uses.
// World 1 keeps its original keys ('quiz', 'complete', plates[1]) so every existing wol.v1 save stays valid.
import { world1 } from './world-1-born-again-curriculum-content.js';
import { world2 } from './world-2-holy-spirit-curriculum-content.js';
import { state, save, isDone } from './saved-progress-and-settings-state.js';

// World 2 has content but stays closed to learners until its map and art exist (WORLDS[1].ready in worlds-overview-six-world-metadata.js).
const CONTENT = new Map([[1, world1], [2, world2]]);

/** Make a world playable. A world's content module calls this once it has lessons, a review and a bookplate. */
export const registerWorld = (world) => CONTENT.set(world.id, world);
export const worldById = (id) => CONTENT.get(Number(id));
export const allWorlds = () => [...CONTENT.values()];

/** The world the learner is currently playing. Falls back to World 1 when the saved id has no content. */
export const activeWorldId = () => (CONTENT.has(state.activeWorld) ? state.activeWorld : 1);
export const activeWorld = () => CONTENT.get(activeWorldId());
export function setActiveWorld(id) {
  if (!CONTENT.has(Number(id))) return false;
  state.activeWorld = Number(id);
  save();
  return true;
}

// Saved-progress keys. Lesson and puzzle ids are unique across worlds, so only the review and reward need a world suffix.
export const lessonDoneKey = (lesson) => 't_' + lesson.id;
export const reviewDoneKey = (world) => (world.id === 1 ? 'quiz' : 'quiz' + world.id);
export const completeDoneKey = (world) => (world.id === 1 ? 'complete' : 'complete' + world.id);
export const rewardCollected = (world) => Boolean(state.plates[world.id]);

/** A world opens once the review of the world before it is done. World 1 is always open. */
export function isWorldUnlocked(id) {
  const previous = CONTENT.get(Number(id) - 1);
  return Number(id) === 1 || Boolean(previous && isDone(reviewDoneKey(previous)));
}
