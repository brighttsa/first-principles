// Learning stats, achievements and the Daily Word. Achievements celebrate understanding only;
// there are no streak penalties, and "days practiced" never resets.
import { world1 } from './world-1-born-again-curriculum-content.js';
import { state, save, isDone } from './saved-progress-and-settings-state.js';
import { reviewDoneKey, allWorlds } from './worlds-registry-active-world-and-progress-keys.js';
import { adaptiveOn, pickReviewPuzzle } from './adaptive-learning-signals-mastery-and-review-scheduling.js';

const dayKey = (t = Date.now()) => new Date(t).toISOString().slice(0, 10);

export function stats() {
  const done = Object.entries(state.done), days = new Set(done.map(([, t]) => dayKey(t)));
  Object.keys(state.daily || {}).forEach((d) => days.add(d));
  const ft = Object.values(state.firstTry), lessons = world1.lessons.filter((l) => isDone('t_' + l.id)).length;
  return {
    puzzles: done.filter(([k]) => /^p\d+$/.test(k)).length, lessons, lessonsTotal: world1.lessons.length,
    verses: Object.keys(state.saved).length, remembered: Object.values(state.saved).filter((v) => v.box > 0).length,
    days: days.size, dailies: Object.keys(state.daily || {}).length,
    accuracy: ft.length ? Math.round((ft.filter(Boolean).length / ft.length) * 100) : null,
  };
}

/** Each plot is derived from the same saved learning milestones everywhere it appears. */
export function gardenPlantStages(world = world1) {
  const lessons = world.lessons.map(lesson => {
    if (isDone('t_' + lesson.id)) return 2;
    return lesson.puzzles.some(puzzle => isDone(puzzle.id)) ? 1 : 0;
  });
  return [...lessons, isDone(reviewDoneKey(world)) ? 2 : 0, state.plates[world.id] ? 2 : 0];
}

// Each world has its own list. A medal's id is also its painted file: assets/medals/painted/<id>.png.
// The general achievements (first puzzle, Verse Keeper, Daily Word) live in World 1's list; later worlds celebrate their own lessons.
const ACHIEVEMENTS_BY_WORLD = {
  1: [
    { id: 'first', name: 'First Steps', note: 'Solve your first puzzle', ok: (s) => s.puzzles >= 1 },
    { id: 'five', name: 'Word Explorer', note: 'Solve 5 puzzles', ok: (s) => s.puzzles >= 5 },
    { id: 'spirit', name: 'Water and Spirit', note: 'Finish lesson 2 (Jn 3:5-6)', ok: () => isDone('t_l2') },
    { id: 'creature', name: 'A New Creature', note: 'Finish lesson 3 (2 Cor 5:17)', ok: () => isDone('t_l3') },
    { id: 'buster', name: 'Misconception Buster', note: 'Sort every statement correctly', ok: () => isDone('p10') },
    { id: 'keeper', name: 'Verse Keeper', note: 'Save 4 verses to your Library', ok: (s) => s.verses >= 4 },
    { id: 'remember', name: 'Remembered', note: 'Recall a saved verse', ok: (s) => s.remembered >= 1 },
    { id: 'daily', name: 'Daily Word', note: 'Complete a Daily Word', ok: (s) => s.dailies >= 1 },
    { id: 'world1', name: 'Born Again Scholar', note: 'Complete World 1', ok: () => Boolean(state.plates[1]) },
  ],
  2: [
    { id: 'inus', name: 'Jesus in Us', note: 'Finish lesson 1 (Jn 14:16-18)', ok: () => isDone('t_l5') },
    { id: 'fellow', name: 'Fellowship', note: 'Finish lesson 2 (2 Cor 13:14)', ok: () => isDone('t_l6') },
    { id: 'seven', name: 'The Seven Spirits', note: 'Finish lesson 3 (Isa 11:2)', ok: () => isDone('t_l7') },
    { id: 'tongues', name: 'Speaking in Tongues', note: 'Finish lesson 4 (Acts 2:4)', ok: () => isDone('t_l8') },
    { id: 'world2', name: 'Holy Spirit Scholar', note: 'Complete World 2', ok: () => Boolean(state.plates[2]) },
  ],
};
export const achievementState = (world = world1) => { const s = stats(); return ACHIEVEMENTS_BY_WORLD[world.id].map((a) => ({ ...a, got: Boolean(a.ok(s)) })); };

// Daily Word: one exercise per day. When an idea is due for review (it was hard, or its review date has come) that puzzle comes back;
// otherwise it is chosen from World 1 by date so every device sees the same one. Learners with no review data get the date choice.
const POOL = ['p1', 'p11', 'p9', 'p3', 'p8', 'p12', 'p4', 'p13', 'p7', 'p14', 'p2', 'p5'];
export const todayKey = () => dayKey();
export function dailyPuzzle() {
  const everyPuzzle = allWorlds().flatMap((w) => w.lessons.flatMap((l) => l.puzzles));
  const due = adaptiveOn() ? pickReviewPuzzle(everyPuzzle) : null;
  if (due) return due;
  const all = world1.lessons.flatMap((l) => l.puzzles), day = Math.floor(Date.now() / 86400000);
  const id = POOL[day % POOL.length]; return all.find((p) => p.id === id);
}
export const dailyDone = () => Boolean(state.daily?.[todayKey()]);
export function markDailyDone() { state.daily = state.daily || {}; state.daily[todayKey()] = true; save(); }
