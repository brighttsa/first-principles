// Persistent player state: settings, lesson progress, saved verses, notes, spaced-repetition boxes.
// localStorage is wrapped in try/catch: the game still runs when storage is blocked.
const KEY = 'wol.v1';
const DAY = 86400000;
const BOX_DAYS = [1, 3, 7, 14, 30];

const defaults = () => ({
  started: false,
  activeWorld: 1,  // world id currently being played
  level: 'sprout', // seedling = child, sprout = teen, oak = adult (stored as child|teen|adult)
  settings: { sfx: true, music: false, narration: false, haptics: true, motion: 'auto', text: 1, focus: false, adaptive: true, bibleVersion: 'KJV' },
  done: {},        // puzzle / lesson ids -> timestamp
  daily: {},       // YYYY-MM-DD -> true (Daily Word completed)
  saved: {},       // verse ref -> { box, due }
  notes: {},       // lesson id -> text
  plates: {},      // world id -> true
  firstTry: {},    // quiz question id -> bool
  learn: { puzzles: {} }, // adaptive learning signals per puzzle id (see adaptive-learning-signals-mastery-and-review-scheduling.js)
  wordGarden: { bonusFound: {} }, // optional authored word discoveries, additive to existing wol.v1 saves
});

function load() {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || 'null');
    if (!raw) return defaults();
    const d = defaults();
    const garden = raw.wordGarden && typeof raw.wordGarden === 'object' ? raw.wordGarden : {};
    const bonusFound = garden.bonusFound && typeof garden.bonusFound === 'object' ? garden.bonusFound : {};
    return { ...d, ...raw, settings: { ...d.settings, ...raw.settings },
      wordGarden: { ...d.wordGarden, ...garden, bonusFound: { ...d.wordGarden.bonusFound, ...bonusFound } } };
  } catch { return defaults(); }
}

export const state = load();
if (!['child', 'teen', 'adult'].includes(state.level)) state.level = 'teen';
if (!['KJV', 'NIV', 'NLT', 'MSG', 'EASY'].includes(state.settings.bibleVersion)) state.settings.bibleVersion = 'KJV';

export function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* storage blocked */ } }

export function markDone(id) { if (!state.done[id]) { state.done[id] = Date.now(); save(); } }
export const isDone = (id) => Boolean(state.done[id]);

export function saveVerse(ref) {
  if (!state.saved[ref]) { state.saved[ref] = { box: 0, due: Date.now() + DAY }; save(); }
}

/** Leitner spacing: a correct recall moves up a box, a miss returns to box 0. No penalty beyond the schedule. */
export function recordRecall(ref, correct) {
  const v = state.saved[ref]; if (!v) return;
  v.box = correct ? Math.min(v.box + 1, BOX_DAYS.length - 1) : 0;
  v.due = Date.now() + BOX_DAYS[v.box] * DAY;
  save();
}
export const dueVerses = () => Object.keys(state.saved).filter((r) => state.saved[r].due <= Date.now());

export function applySettings() {
  const r = document.documentElement, s = state.settings;
  r.style.setProperty('--text', s.text);
  r.dataset.motion = s.motion === 'on' ? 'reduced' : s.motion === 'off' ? 'full' : 'auto';
  r.dataset.focus = s.focus ? 'on' : 'off';
  r.dataset.level = state.level;
}

export function resetAll() { try { localStorage.removeItem(KEY); } catch { /* ignore */ } location.reload(); }
