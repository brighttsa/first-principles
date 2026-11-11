// Accessible Scripture card renderer. The lesson's exact-word puzzles stay explicitly KJV-anchored.
import { esc } from './core-utilities-and-dom-helpers.js';
import { speak } from './sound-effects-music-narration-haptics.js';
import { state } from './saved-progress-and-settings-state.js';
import { BIBLE_VERSIONS, bibleVersionOptions, getBiblePassage, preferredBibleVersion, setPreferredBibleVersion } from './bible-text-provider-and-authorized-translation-states.js';

const versionCard = (ref, id, slot, hidden = false) => `<article class="bible-verse-card" data-version-card="${slot}" data-bible-id="${id}" ${hidden ? 'hidden' : ''}>
  <header class="bible-verse-heading"><h3 data-bible-title>${esc(BIBLE_VERSIONS[id].name)}</h3><span class="bible-version-badge" data-bible-abbr>${esc(id)}</span></header>
  ${slot === 'compare' ? `<label class="bible-compare-select">Compare with<select data-bible-compare-version aria-label="Second Bible version">${bibleVersionOptions(id)}</select></label>` : ''}
  <p class="bible-reference" data-bible-reference>${esc(ref)}</p>
  <p class="bible-verse-text" data-bible-text hidden></p>
  <p class="bible-reader-status" data-bible-status role="status" aria-live="polite">Loading ${esc(id)}…</p>
  <div class="bible-reader-actions" data-bible-actions hidden></div>
</article>`;

/** Vanilla BibleVerse component: accepts the exact reference and translation identifier. */
export function BibleVerse(ref, translationId = preferredBibleVersion(), options = {}) {
  const locked = Boolean(options.puzzleSource);
  const simple = options.simple ?? state.level === 'child';
  const compareId = options.compareVersion || (translationId === 'KJV' ? 'NIV' : 'KJV');
  return `<section class="bible-reader${simple ? ' bible-reader--simple' : ''}" data-bible-reader data-ref="${esc(ref)}" data-version="${esc(translationId)}" data-compare-version="${esc(compareId)}" data-simple="${simple}" data-puzzle-source="${locked}">
    <div class="bible-reader-tools">${locked
      ? '<span class="bible-reader-label">Puzzle Scripture · KJV</span>'
      : `<label class="bible-version-select">Read in<select data-bible-version aria-label="Bible version">${bibleVersionOptions(translationId)}</select></label>`}
      ${locked ? '' : '<button class="chip bible-compare-toggle" type="button" data-bible-compare-toggle aria-expanded="false">Compare versions</button>'}
    </div>
    <div class="bible-reader-grid">${versionCard(ref, translationId, 'primary')}${versionCard(ref, compareId, 'compare', true)}</div>
    ${locked ? '<p class="bible-puzzle-note">This activity keeps its KJV wording so the Scripture puzzle answer stays exact.</p>' : ''}
  </section>`;
}

function cardStatus(card, message, actions = '') {
  const status = card.querySelector('[data-bible-status]');
  const actionsBox = card.querySelector('[data-bible-actions]');
  const text = card.querySelector('[data-bible-text]');
  text.hidden = true; actionsBox.hidden = !actions;
  actionsBox.innerHTML = actions;
  status.hidden = false; status.textContent = message;
}

async function hydrateCard(reader, slot) {
  const card = reader.querySelector(`[data-version-card="${slot}"]`);
  if (!card || card.hidden) return;
  const id = slot === 'primary' ? reader.dataset.version : reader.dataset.compareVersion;
  const version = BIBLE_VERSIONS[id];
  card.dataset.bibleId = id;
  card.querySelector('[data-bible-title]').textContent = version?.name || 'Bible version';
  card.querySelector('[data-bible-abbr]').textContent = version?.abbreviation || id;
  card.querySelector('[data-bible-reference]').textContent = reader.dataset.ref;
  const oldText = card.querySelector('[data-bible-text]'); oldText.hidden = true;
  card.querySelector('[data-bible-actions]').hidden = true;
  const status = card.querySelector('[data-bible-status]');
  status.hidden = false; status.textContent = `Loading ${version?.abbreviation || id}…`;
  const passage = await getBiblePassage(reader.dataset.ref, id);
  if (!reader.isConnected || card.dataset.bibleId !== id) return;
  if (passage.status === 'unavailable') {
    cardStatus(card, `${version?.name || 'This translation'} text is not available inside the game yet.`,
      `<a class="bible-official-link" href="${esc(version.officialUrl)}" target="_blank" rel="noopener noreferrer">Open ${esc(version.name)} reading options</a><button class="btn" type="button" data-use-kjv>Use KJV in this game</button>`);
    return;
  }
  if (passage.status !== 'ready') {
    const message = passage.status === 'offline'
      ? 'You are offline and this passage is not in the built-in lesson library.'
      : 'The KJV text service could not load this passage. Check your connection and try again.';
    cardStatus(card, message, '<button class="btn alt" type="button" data-bible-retry>Try again</button>');
    return;
  }
  oldText.textContent = passage.text; oldText.hidden = false; status.hidden = true;
  const actions = card.querySelector('[data-bible-actions]');
  if (id === 'KJV' && state.settings.narration && 'speechSynthesis' in window) {
    actions.innerHTML = '<button class="btn alt" type="button" data-bible-listen>Listen</button>';
    actions.hidden = false;
  }
}

function readersWithin(root) {
  return [...(root.matches?.('[data-bible-reader]') ? [root] : []), ...root.querySelectorAll('[data-bible-reader]')];
}
export function hydrateBibleReaders(root) {
  readersWithin(root).forEach((reader) => {
    hydrateCard(reader, 'primary');
    hydrateCard(reader, 'compare');
  });
}

export function wireBibleReaders(root) {
  if (!root.dataset.bibleReadersWired) {
    root.dataset.bibleReadersWired = 'true';
    root.addEventListener('change', (event) => {
      const target = event.target;
      if (target.matches('[data-bible-version]')) {
        setPreferredBibleVersion(target.value);
        root.querySelectorAll('[data-bible-version]').forEach((select) => { select.value = target.value; });
        readersWithin(root).forEach((reader) => {
          reader.dataset.version = target.value;
          const primarySelect = reader.querySelector('[data-bible-version]');
          if (primarySelect) primarySelect.value = target.value;
          const second = reader.querySelector('[data-bible-compare-version]');
          if (second && second.value === target.value) second.value = target.value === 'KJV' ? 'NIV' : 'KJV';
          reader.dataset.compareVersion = second?.value || (target.value === 'KJV' ? 'NIV' : 'KJV');
        });
        hydrateBibleReaders(root);
      } else if (target.matches('[data-bible-compare-version]')) {
        const reader = target.closest('[data-bible-reader]');
        reader.dataset.compareVersion = target.value;
        hydrateCard(reader, 'compare');
      }
    });
    root.addEventListener('click', (event) => {
      const target = event.target.closest('button');
      if (!target) return;
      const reader = target.closest('[data-bible-reader]');
      if (target.matches('[data-bible-compare-toggle]') && reader) {
        const card = reader.querySelector('[data-version-card="compare"]');
        card.hidden = !card.hidden;
        target.setAttribute('aria-expanded', String(!card.hidden));
        target.textContent = card.hidden ? 'Compare versions' : 'Hide comparison';
        if (!card.hidden) hydrateCard(reader, 'compare');
      } else if (target.matches('[data-use-kjv]')) {
        setPreferredBibleVersion('KJV');
        root.querySelectorAll('[data-bible-version]').forEach((select) => { select.value = 'KJV'; });
        readersWithin(root).forEach((item) => {
          item.dataset.version = 'KJV';
          const select = item.querySelector('[data-bible-version]'); if (select) select.value = 'KJV';
        });
        hydrateBibleReaders(root);
      } else if (target.matches('[data-bible-retry]') && reader) {
        const card = target.closest('[data-version-card]');
        hydrateCard(reader, card.dataset.versionCard);
      } else if (target.matches('[data-bible-listen]') && reader) {
        const card = target.closest('[data-version-card]');
        speak(`${reader.dataset.ref}. ${card.querySelector('[data-bible-text]').textContent}`);
      }
    });
  }
  hydrateBibleReaders(root);
}
