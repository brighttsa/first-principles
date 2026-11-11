// Final comprehension challenge, then the chapter completion celebration: paper confetti, Kenney medal,
// original bookplate, and a summary of what was learned. Rewards celebrate learning, never spiritual worth.
import { activeWorld, reviewDoneKey, completeDoneKey } from './worlds-registry-active-world-and-progress-keys.js';
import { lessonVerses } from './answer-feedback-cited-verse-lookup.js';
import { runQuiz } from './knowledge-challenge-multiple-choice-with-explanations.js';
import { state, save, markDone, isDone } from './saved-progress-and-settings-state.js';
import { worldBookplateArt } from './art-cartoon-landscape-scenes-and-adventure-map.js';
import { sunriseScene } from './art-cartoon-landscape-scenes-and-adventure-map.js';
import { sprig } from './art-sprig-character-and-world-glyphs.js';
import { topbar, confetti } from './ui-navigation-topbar-sheet-and-confetti.js';
import { sfx } from './sound-effects-music-narration-haptics.js';
import { $, esc } from './core-utilities-and-dom-helpers.js';
import { CHAPTER_CHALLENGE_COMPLETE_KEY, chapterChallengeDoneKey } from './world-1-chapter-challenge-content.js';

const celebrationKey = (world) => `wol.chapterCelebrated.${world.id}`;

export function renderQuiz(root, _p, go) {
  root.innerHTML = `<div class="screen">${topbar('Knowledge Challenge', { back: true })}<div class="page"><div class="card" id="q"></div></div></div>`;
  $('[data-back]', root).onclick = () => go('map');
  const world = activeWorld();
  runQuiz($('#q', root), world.quiz, {
    verses: world.lessons.flatMap(lessonVerses),
    onFirstTry: (id, ok) => { state.firstTry[id] = ok; save(); },
    onDone: (res) => {
      markDone(reviewDoneKey(world)); state.plates[world.id] = true; markDone(completeDoneKey(world)); save();
      sessionStorage.removeItem(celebrationKey(world));
      sessionStorage.setItem('wol.res', JSON.stringify({ ...res, completionId: Date.now() })); go('complete');
    },
  });
}

export function renderComplete(root, _p, go) {
  const world = activeWorld(), res = JSON.parse(sessionStorage.getItem('wol.res') || 'null');
  const challengeFinished = world.id === 1 && isDone(CHAPTER_CHALLENGE_COMPLETE_KEY);
  const challengeStarted = world.id === 1 && world.chapterChallenge.some((stage) => isDone(chapterChallengeDoneKey(stage.id)));
  root.innerHTML = `<div class="screen scenic">${sunriseScene(world.id)}<div class="content"><div class="card rise chapter-complete-card">
    <p class="kicker">Chapter complete</p><h1>World ${world.id}: ${world.name}</h1>
    <img src="assets/medals/painted/${world.medal || 'world1'}.png" alt="Chapter mastery medal" height="110" class="pop chapter-medal">
    <div class="plate unfold chapter-bookplate">${worldBookplateArt(world)}<b>${world.bookplate.title}</b><span class="muted">Collectible bookplate</span></div>
    ${res ? `<p>You answered <b>${res.firstTry} of ${res.total}</b> questions on the first try. ${res.firstTry === res.total ? 'Well done. Keep treasuring the Word.' : 'Wrong answers are how we learn, so keep going!'}</p>` : ''}
    <p class="kicker">What you learned</p>
    <ul class="chapter-lessons">${world.lessons.map((l) => `<li><b>${esc(l.title)}</b> (${esc(l.ref)})</li>`).join('')}</ul>
    <div class="feedback chapter-feedback">${sprig('cheer')}</div>
    ${world.id === 1 ? challengeFinished ? '<p class="challenge-finished-note">Optional Chapter Challenge complete.</p>' : `<aside class="chapter-challenge-callout"><div><p class="kicker">Optional next step</p><p>Three short activities connect the chapter’s key ideas.</p></div><button class="btn alt" id="challenge">${challengeStarted ? 'Continue Chapter Challenge' : 'Try Chapter Challenge'}</button></aside>` : ''}
    <div class="row"><button class="btn big" id="lib">Review in Library</button><button class="btn alt" id="gar">Visit my Garden</button><button class="btn alt" id="map">Back to map</button></div></div></div></div>`;
  const celebration = res?.completionId || 'legacy';
  if (res && sessionStorage.getItem(celebrationKey(world)) !== String(celebration)) {
    sessionStorage.setItem(celebrationKey(world), String(celebration));
    confetti(40); sfx('chapter', .6);
  }
  $('#challenge', root)?.addEventListener('click', () => go('challenge'));
  $('#lib', root).onclick = () => go('library'); $('#gar', root).onclick = () => go('garden'); $('#map', root).onclick = () => go('map');
}
