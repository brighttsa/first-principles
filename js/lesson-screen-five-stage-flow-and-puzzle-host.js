// A lesson: Discover/Explore -> Play (puzzles in the exercise frame) -> Truth Revealed.
// Progress persists, so leaving or refreshing resumes at the first unfinished exercise.
import { $, esc } from './core-utilities-and-dom-helpers.js';
import { activeWorld } from './worlds-registry-active-world-and-progress-keys.js';
import { state, markDone, isDone } from './saved-progress-and-settings-state.js';
import { icons } from './art-sprig-character-and-world-glyphs.js';
import { companion } from './art-mascot-sprout-with-expressions.js';
import { sfx, speak, stopSpeaking } from './sound-effects-music-narration-haptics.js';
import { topbar } from './ui-navigation-topbar-sheet-and-confetti.js';
import { studyPanel, wireStudyPanel } from './lesson-study-panel-scripture-notes-and-references.js';
import { truthCard } from './lesson-truth-revealed-teaching-card.js';
import { lessonVerses } from './answer-feedback-cited-verse-lookup.js';
import { runExercise } from './exercise-host-with-progress-bar-and-feedback-sheet.js';
import { BibleVerse, hydrateBibleReaders, wireBibleReaders } from './bible-verse-reader-and-version-comparison-component.js';

export function renderLesson(root, { n = 0 }, go) {
  const world = activeWorld(), L = world.lessons[n]; if (!L) return go('quiz');
  const field = L.fieldLesson;
  const gardenOpening = world.id === 1 && n === 0;
  const total = world.lessons.length, steps = ['explore', ...L.puzzles.map((p) => p.id), 'truth'];
  const firstOpen = L.puzzles.findIndex((p) => !isDone(p.id));
  // Older saves can have a completed lesson and newly added exercises; resume the first unfinished puzzle without rewriting progress.
  let step = firstOpen < 0 ? steps.length - 1 : L.puzzles.some((p) => isDone(p.id)) ? firstOpen + 1 : 0;
  let stopExercise = () => {};

  root.innerHTML = `<div class="screen" data-lesson="${n}"${field ? ' data-field-lesson' : ''}>${topbar(esc(world.name), { back: true, heading: false })}
    <div class="lesson"><section class="stage" id="stage"></section>${studyPanel(L, true)}</div></div>`;
  wireStudyPanel(root, L);
  wireBibleReaders(root);
  $('[data-back]', root).onclick = () => go('map');
  const screen = root.firstElementChild;
  const stage = $('#stage', root), verseBox = $('.study-primary', root);
  const clean = () => { stopExercise(); stopExercise = () => {}; stopSpeaking(); };

  function show() {
    clean(); const id = steps[step];
    if (id === 'explore') return explore();
    if (id === 'truth') return truth();
    const currentPuzzle = L.puzzles.find((puzzle) => puzzle.id === id);
    if (currentPuzzle && isDone(currentPuzzle.id)) { step++; return show(); }
    screen.dataset.phase = 'solve';
    const p = L.puzzles.find((q) => q.id === id), k = L.puzzles.indexOf(p) + 1; verseBox.open = false;
    stopExercise = runExercise(stage, p, {
      level: state.level, heading: `Lesson ${n + 1}: ${L.title}`, verses: lessonVerses(L), label: `${k} of ${L.puzzles.length}`, pct: Math.round((step / (steps.length - 1)) * 100),
      onExit: () => go('map'), onSolved: (q) => markDone(q.id), onContinue: () => { step++; show(); if (p.adventure) window.scrollTo(0, 0); },
    });
  }
  function explore() {
    screen.dataset.phase = 'discover';
    // Keep the first discovery screen short; the complete teaching stays in the study panel.
    verseBox.open = false;
    const txt = n === 0
      ? state.level === 'child' ? 'Jesus told Nicodemus that we must be born again to see God’s kingdom.' : 'Jesus told Nicodemus that a person must be born again to see God’s kingdom.'
      : state.level === 'child' ? L.introKid : L.intro;
    const playFirst = gardenOpening && !state.settings.focus;
    const play = '<button class="btn big" id="go">Start puzzles</button>';
    const objective = field ? `<p class="field-objective"><span class="kicker">Your mission</span>${esc(state.level === 'child' ? field.childGoal : field.goal)}</p>` : '';
    stage.innerHTML = `<div class="card lesson-discover rise"><div class="lesson-discover-heading"><div><p class="kicker">Lesson ${n + 1} of ${total} · Discover</p><h1>${esc(L.title)}</h1></div>${companion('sprig', 'curious')}</div>
      ${objective}<p>${esc(txt)}</p>${playFirst ? `<div class="row">${play}</div>` : ''}<section class="lesson-reading" aria-labelledby="lesson-reading-title">
      <h2 id="lesson-reading-title">Read ${esc(L.ref)}</h2>${BibleVerse(L.ref, state.settings.bibleVersion, { simple: state.level === 'child' })}</section>
      <div class="row">${playFirst ? '' : play}<button class="btn alt" id="listen">${icons.speaker} Listen</button></div></div>`;
    hydrateBibleReaders(stage);
    $('#listen', stage).onclick = () => {
      const kjvReading = state.settings.bibleVersion === 'KJV' ? ` ${L.ref}, King James Version. ${L.verse}` : '';
      speak(`${L.title}. ${txt}.${kjvReading}`, true);
    };
    $('#go', stage).onclick = () => { sfx('page'); step++; show(); if (gardenOpening) window.scrollTo(0, 0); };
    speak(txt);
  }
  function truth() {
    screen.dataset.phase = 'truth';
    verseBox.open = true;
    const t = truthCard(L, n, total, { next: () => go(n < total - 1 ? 'lesson/' + (n + 1) : 'quiz') });
    stage.innerHTML = t.html; t.wire(stage);
    const title = $('h2', stage);
    title.setAttribute('role', 'heading'); title.setAttribute('aria-level', '1');
    title.tabIndex = -1; title.focus();
  }
  show();
  return clean;
}
