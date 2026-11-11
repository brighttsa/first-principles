// Word Treasury screen: one page per Word Garden level, holding the words found there beside the level's KJV reference.
// The verse opens through the existing Bible reader, rendered only when a page's "Read" panel is first opened, so ten
// pages never fetch ten passages at once.
import { topbar } from './ui-navigation-topbar-sheet-and-confetti.js';
import { esc } from './core-utilities-and-dom-helpers.js';
import { state } from './saved-progress-and-settings-state.js';
import { BibleVerse, wireBibleReaders } from './bible-verse-reader-and-version-comparison-component.js';
import { treasuryPages } from './word-treasury-collection-of-word-garden-finds.js';

const KIND_LABEL = { key: 'Key word', garden: 'Garden word', bonus: 'Bonus word', golden: 'Golden word' };

function wordChip({ word, kind, found }) {
  if (found) return `<li class="wt-word" data-kind="${kind}"><span class="wt-word-text">${esc(word)}</span><span class="wt-word-kind">${KIND_LABEL[kind]}</span></li>`;
  // An unfound golden word keeps its secret; other words show their length as a nudge.
  const label = kind === 'golden' ? 'Hidden golden word, not found yet' : `${KIND_LABEL[kind]}, ${word.length} letters, not found yet`;
  return `<li class="wt-word wt-word--missing" data-kind="${kind}" aria-label="${label}"><span class="wt-word-text" aria-hidden="true">${kind === 'golden' ? '?' : '·'.repeat(word.length)}</span><span class="wt-word-kind" aria-hidden="true">${kind === 'golden' ? 'Golden word' : `${word.length} letters`}</span></li>`;
}

function pageCard(page) {
  const { level } = page;
  const heading = `<p class="kicker">Level ${level.levelNumber} · ${esc(level.ref)} · KJV</p><h2>${esc(level.title)}</h2>`;
  if (!page.started) {
    return `<article class="card wt-page wt-page--locked" data-level="${level.id}">${heading}
      <p class="muted">Play Word Garden level ${level.levelNumber} to start this page.</p></article>`;
  }
  return `<article class="card wt-page${page.complete ? ' wt-page--complete' : ''}" data-level="${level.id}">${heading}
    <p class="wt-page-count">${page.complete ? 'Page complete: ' : ''}${page.found} of ${page.total} words</p>
    <ul class="wt-words" aria-label="Words on this page">${page.words.map(wordChip).join('')}</ul>
    <details class="wt-verse" data-ref="${esc(level.ref)}"><summary>Read ${esc(level.ref)}</summary><div class="wt-verse-body"></div></details></article>`;
}

export function renderTreasury(root, _params, go) {
  const { pages, found, total, completePages } = treasuryPages();
  const percent = total ? Math.round((found / total) * 100) : 0;
  root.innerHTML = `<div class="screen treasury-screen">${topbar('Word Treasury', { back: true })}<div class="page">
    <section class="card wt-summary" aria-label="Collection summary">
      <p class="wt-summary-count"><b>${found}</b> of ${total} words kept</p>
      <div class="wt-meter" role="progressbar" aria-label="Words kept" aria-valuemin="0" aria-valuemax="${total}" aria-valuenow="${found}"><span style="width:${percent}%"></span></div>
      <p class="muted">${completePages} of ${pages.length} pages complete. Every word you find in the Word Garden is kept here beside its verse. Replay a level to fill its page.</p>
    </section>
    <h2 class="wt-world-heading">World 1 · Word Garden</h2>
    <div class="wt-pages">${pages.map(pageCard).join('')}</div></div></div>`;

  const screen = root.firstElementChild;
  screen.querySelector('[data-back]').onclick = () => go('garden');
  // The Bible reader is created the first time a page's verse panel opens.
  screen.querySelector('.wt-pages').addEventListener('toggle', (event) => {
    const panel = event.target;
    if (!panel.matches?.('.wt-verse') || !panel.open || panel.dataset.loaded) return;
    panel.dataset.loaded = 'true';
    const body = panel.querySelector('.wt-verse-body');
    body.innerHTML = BibleVerse(panel.dataset.ref, state.settings.bibleVersion, { simple: state.level === 'child' });
    wireBibleReaders(body);
  }, true);
}
