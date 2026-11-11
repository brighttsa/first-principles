// Word Treasury: every word a player finds in the Word Garden becomes a kept word on its level's page, beside the
// level's KJV reference. Pages fill per level; the golden word stays hidden until found. Counts describe what was
// collected in the puzzles, never the player's standing before God.
// Saved additively in wol.v1 as state.wordGarden.treasury[levelId] = [words]; bonus words keep their existing
// bonusFound store, and key words of finished levels count even when they were found before the treasury existed.
import { state, save, isDone } from './saved-progress-and-settings-state.js';
import { world1WordGardenLevels } from './world-1-word-garden-level-content.js';

const garden = () => (state.wordGarden ||= { bonusFound: {} });

/** Keeps one required word (key word, garden word or second-rack word) found on a level. */
export function recordTreasuryWord(levelId, word) {
  const store = (garden().treasury ||= {});
  const words = store[levelId] ||= [];
  if (!words.includes(word)) { words.push(word); save(); }
}

/** Every word a level's page can hold, in display order: key words, garden words, then bonus words. */
function pageWords(level) {
  const key = level.targetWords, gardenWords = level.gardenWords || [];
  const bonus = [...level.bonusWords, ...(level.nextBonusWords || [])].filter((item) => !key.includes(item) && !gardenWords.includes(item));
  return [
    ...key.map((item) => ({ word: item, kind: 'key' })),
    ...gardenWords.map((item) => ({ word: item, kind: 'garden' })),
    ...[...new Set(bonus)].map((item) => ({ word: item, kind: item === level.goldenWord ? 'golden' : 'bonus' })),
  ];
}

/** One level's page: which words are kept, how many remain, and whether the level has been played at all. */
export function treasuryPage(level) {
  const kept = new Set([
    ...(garden().treasury?.[level.id] || []),
    ...(garden().bonusFound?.[level.id] || []),
    ...(isDone(level.id) ? level.targetWords : []),
  ]);
  const words = pageWords(level).map((entry) => ({ ...entry, found: kept.has(entry.word) }));
  const found = words.filter((entry) => entry.found).length;
  return { level, words, found, total: words.length, started: found > 0 || isDone(level.id), complete: found === words.length };
}

/** The line under a finished level: how full its treasury page is. Empty for puzzles without a page (the chapter challenge). */
export function treasuryNoteMarkup(levelId) {
  const level = world1WordGardenLevels.find((item) => item.id === levelId);
  if (!level) return '';
  const page = treasuryPage(level);
  return `<p class="wg-treasury-note">Word Treasury: ${page.found} of ${page.total} words kept on this page.</p>`;
}

/** All World 1 pages plus collection totals. */
export function treasuryPages() {
  const pages = world1WordGardenLevels.map(treasuryPage);
  return {
    pages,
    found: pages.reduce((sum, page) => sum + page.found, 0),
    total: pages.reduce((sum, page) => sum + page.total, 0),
    completePages: pages.filter((page) => page.complete).length,
  };
}
