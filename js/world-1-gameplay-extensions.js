// Keep optional World 1 activity data separate from the core lesson text.
import { attachWorld1WordGardenLevels } from './world-1-word-garden-level-content.js';
import { attachWorld1ScriptureTrails } from './world-1-scripture-trail-level-content.js';
import { attachWorld1HiddenWordHunt } from './world-1-hidden-word-hunt-level-content.js';
import { attachWorld1ChapterChallenge } from './world-1-chapter-challenge-content.js';

export function attachWorld1GameplayExtensions(world) {
  attachWorld1WordGardenLevels(world);
  attachWorld1ScriptureTrails(world);
  attachWorld1HiddenWordHunt(world);
  attachWorld1ChapterChallenge(world);
}
