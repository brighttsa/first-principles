// Adaptive learning: what the game quietly learns about how each puzzle went, and what it does with that.
// It adapts support and review, never the Scripture or the teaching. Everything stays on this device in state.learn.
//
// Signals per puzzle: attempts, misses (wrong answers), hints used, clean attempts (solved with no miss and no hint),
// and retained recalls (a clean solve when the puzzle came back as a review). Time spent is not tracked, so slow readers
// are never penalised.
//
// Four things are kept apart on purpose:
//   completion = the puzzle was solved at least once (state.done)
//   accuracy   = clean attempts out of all attempts
//   mastery    = how secure the idea is: new, learning, practising, secure
//   retention  = recalled cleanly in a later review (retained)
// One correct answer is never "secure": it takes a clean recall in a later review.
import { state, save, isDone } from './saved-progress-and-settings-state.js';

const DAY = 86400000;
const BOX_DAYS = [1, 3, 7, 14, 30]; // review gap after each mastery box, as in the Library's verse review
const SUPPORT_AFTER_MISSES = 2;
const LEVELS = ['child', 'teen', 'adult'];

export const adaptiveOn = () => state.settings.adaptive !== false;
/** True when the teaching should be shown again, after this many wrong answers in one attempt. */
export const needsSupport = (misses) => adaptiveOn() && misses >= SUPPORT_AFTER_MISSES;

const puzzles = () => ((state.learn ||= { puzzles: {} }).puzzles ||= {});
export const learnRecord = (id) => puzzles()[id] || null;

/** Record how one attempt went. `review` is true when the puzzle came back as a review (Daily Word). */
export function recordAttempt(id, { miss = 0, hint = 0, review = false } = {}) {
  const r = (puzzles()[id] ||= { attempts: 0, misses: 0, hints: 0, clean: 0, retained: 0, box: 0, last: 0, due: 0 });
  const clean = miss === 0 && hint === 0, now = Date.now();
  const first = r.attempts === 0;
  const scheduled = review && !first && r.due > 0 && r.due <= now;
  const hard = miss >= SUPPORT_AFTER_MISSES || hint >= 2;
  r.attempts += 1; r.misses += miss; r.hints += hint;
  if (clean) r.clean += 1;
  if (clean && scheduled) r.retained += 1;
  // Extra practice still counts towards accuracy, but cannot advance or postpone a scheduled recall.
  if (first || scheduled || hard) {
    r.box = hard ? 0 : clean ? Math.min(r.box + 1, BOX_DAYS.length - 1) : r.box;
    const days = first || hard || !clean ? 1 : BOX_DAYS[r.box];
    r.due = now + days * DAY;
  }
  r.needsSupport = !clean;
  r.last = now;
  save();
  return r;
}

/** new, learning, practising or secure. Secure needs a high box and at least one clean recall in a review. */
export function masteryOf(id) {
  const r = learnRecord(id);
  if (!r) return 'new';
  if (r.box >= 3 && r.retained >= 1) return 'secure';
  return r.box >= 1 ? 'practising' : 'learning';
}

// Difficulty changes only the exercise mechanics: distractors and word-search directions.
export function challengeLevel(id, level, review) {
  const record = learnRecord(id), base = LEVELS.indexOf(level);
  if (!adaptiveOn() || !review || !record || base < 0) return level;
  if (record.needsSupport ?? (record.box === 0 && record.misses + record.hints > 0)) return LEVELS[Math.max(0, base - 1)];
  if (base > 0 && masteryOf(id) === 'secure') return LEVELS[Math.min(LEVELS.length - 1, base + 1)];
  return level;
}

export const accuracyOf = (id) => { const r = learnRecord(id); return r && r.attempts ? r.clean / r.attempts : null; };
const struggle = (r) => r.misses + r.hints;

/** Puzzles whose review is due, most in need first: lowest box, then most struggle, then longest overdue. */
export function duePuzzleIds(allPuzzles, now = Date.now()) {
  const ids = new Set(allPuzzles.map((p) => p.id));
  return Object.entries(puzzles())
    .filter(([id, r]) => ids.has(id) && r.due && r.due <= now)
    .sort(([, a], [, b]) => a.box - b.box || struggle(b) - struggle(a) || a.due - b.due)
    .map(([id]) => id);
}
export const pickReviewPuzzle = (allPuzzles, now) => {
  const id = duePuzzleIds(allPuzzles, now)[0];
  return id ? allPuzzles.find((p) => p.id === id) : null;
};

const MASTERY_RANK = { new: 0, learning: 1, practising: 2, secure: 3 };
/** When nothing is due: the learned puzzles that are least secure, oldest first, so a review is always possible after a lesson. */
export function practicePuzzleIds(allPuzzles, count = 3) {
  return allPuzzles.filter((p) => isDone(p.id))
    .sort((a, b) => MASTERY_RANK[masteryOf(a.id)] - MASTERY_RANK[masteryOf(b.id)] || (state.done[a.id] || 0) - (state.done[b.id] || 0))
    .slice(0, count).map((p) => p.id);
}

/** The lesson a learner may want to revisit: it holds a puzzle that was hard (back in box 0 after two or more misses or hints). */
export function lessonToRevisit(world, currentIndex) {
  for (let i = 0; i < world.lessons.length; i += 1) {
    if (i >= currentIndex) break;
    const hard = world.lessons[i].puzzles.some((p) => { const r = learnRecord(p.id); return r && r.box === 0 && (r.misses >= SUPPORT_AFTER_MISSES || r.hints >= 2); });
    if (hard) return { index: i, lesson: world.lessons[i] };
  }
  return null;
}

/** One gentle suggestion for the map, or null. Review comes first; otherwise a lesson worth revisiting. */
export function adaptiveSuggestion({ world, allPuzzles, currentIndex }) {
  if (!adaptiveOn()) return null;
  const due = duePuzzleIds(allPuzzles).length;
  if (due > 0) return { text: due === 1 ? '1 idea is ready to review' : `${due} ideas are ready to review`, action: 'Review now', route: 'review' };
  const back = lessonToRevisit(world, currentIndex);
  return back ? { text: 'Practise ideas that could use another look', action: 'Practise', route: 'review' } : null;
}
