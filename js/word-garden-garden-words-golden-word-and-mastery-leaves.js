// Word Garden depth: garden words, the golden word and three-leaf mastery.
// Key words carry the lesson and are required for everyone. Teen and adult players also fill "garden words" (extra slots
// built from the same rack); children keep the shorter rack, where those words still count as bonus words. A hidden golden
// word and hint-free play earn the other two leaves, which gives replaying a finished level a goal. Leaves describe how a
// puzzle was played, never the player's standing before God.
import { state, save } from './saved-progress-and-settings-state.js';

const usesGardenWords = () => state.level !== 'child';
export const gardenWordsFor = (p) => (usesGardenWords() ? p.gardenWords || [] : []);

/** Words the player must find on the current rack. A two-rack level's garden words belong to its first rack. */
export function requiredWords(p, secondRack) {
  if (p.nextLetters) return secondRack ? [p.targetWords[1]] : [p.targetWords[0], ...gardenWordsFor(p)];
  return [...p.targetWords, ...gardenWordsFor(p)];
}

/** Bonus words on the current rack; for children the garden words remain findable as bonuses. */
export function bonusWordsFor(p, secondRack) {
  if (secondRack) return p.nextBonusWords;
  return usesGardenWords() ? p.bonusWords : [...p.bonusWords, ...(p.gardenWords || [])];
}

/** Slots shown above the wheel: key words first, then garden words. */
export const slotWords = (p) => [
  ...p.targetWords.map((item) => ({ item, kind: 'key' })),
  ...gardenWordsFor(p).map((item) => ({ item, kind: 'garden' })),
];

/** One fixed-width chip for the garden words: a pip per word showing its letter count until found, then a check.
    Its width never changes as words are found, so the board below cannot shift mid-drag. */
export function gardenChipMarkup(garden, found, discovered = '') {
  if (!garden.length) return '';
  const left = garden.filter((item) => !found.has(item));
  const label = `Garden words: ${garden.length - left.length} of ${garden.length} found${left.length ? `. Still to find: ${left.map((item) => `${item.length} letters`).join(', ')}` : ''}`;
  const pips = garden.map((item) => `<span class="wg-pip${found.has(item) ? ' found' : ''}${item === discovered ? ' wg-target just-found' : ''}">${found.has(item) ? '✓' : item.length}</span>`).join('');
  return `<span role="listitem" class="wg-garden-chip" aria-label="${label}"><span class="wg-leaf-icon" aria-hidden="true"></span><span aria-hidden="true" class="wg-pips">${pips}</span></span>`;
}

/** Garden words must be buildable from the first rack and distinct; the golden word must be one of its bonus words. */
export function validGardenContent(p, canFormWord) {
  const garden = p.gardenWords || [];
  return garden.every((item) => canFormWord(p.letters, item) && !p.targetWords.includes(item) && !p.bonusWords.includes(item))
    && (!p.goldenWord || p.bonusWords.includes(p.goldenWord));
}

/** Leaves for this attempt; the best result per level is saved (additive to wol.v1). */
export function awardLeaves(p, { hintsUsed, goldenFound }) {
  const result = { solved: true, noHint: hintsUsed === 0, golden: Boolean(goldenFound) };
  result.earned = 1 + Number(result.noHint) + Number(result.golden);
  const garden = state.wordGarden ||= { bonusFound: {} };
  garden.leaves ||= {};
  result.best = Math.max(result.earned, garden.leaves[p.id] || 0);
  garden.leaves[p.id] = result.best;
  save();
  return result;
}

/** The leaf summary shown under the answered question, with the next goal for a replay. */
export function leavesMarkup(result) {
  const leaf = (on, label) => `<li class="wg-leaf${on ? ' on' : ''}"><span class="wg-leaf-icon" aria-hidden="true"></span>${label}</li>`;
  const goals = [!result.noHint && 'solve it without a hint', !result.golden && 'find the hidden golden word'].filter(Boolean);
  const next = goals.length ? `Play again to ${goals.join(' and ')}.` : 'Every leaf earned.';
  const best = result.best > result.earned ? ` Your best: ${result.best} of 3.` : '';
  return `<div class="wg-leaves" role="group" aria-label="Leaves earned: ${result.earned} of 3">
    <ul>${leaf(true, 'Solved')}${leaf(result.noHint, 'No hints')}${leaf(result.golden, 'Golden word')}</ul>
    <p>${next}${best}</p></div>`;
}
