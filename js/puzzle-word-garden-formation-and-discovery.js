// Word Garden accepts only the finite, authored word list for a level. Letter counts
// are checked again at runtime so malformed content can never make an impossible goal.
import { esc, shuffle } from './core-utilities-and-dom-helpers.js';
import { BibleVerse, wireBibleReaders } from './bible-verse-reader-and-version-comparison-component.js';
import { state, save } from './saved-progress-and-settings-state.js';
import { sfx, buzz } from './sound-effects-music-narration-haptics.js';

import { wireWheelPointer } from './word-garden-wheel-pointer-input.js';
import { sparkBurst } from './kenney-icon-and-sparkle-helpers.js';
import { gardenScene, reactInGarden } from './word-garden-adventure-reactions.js';
import { createDiscoveryFeedback } from './word-garden-discovery-feedback-effects.js';

const word = (value) => String(value).normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toUpperCase().replace(/[^A-Z]/g, '');
export function canFormWord(letters, answer) {
  const counts = [...word(letters)].reduce((map, letter) => map.set(letter, (map.get(letter) || 0) + 1), new Map());
  for (const letter of word(answer)) {
    const left = counts.get(letter) || 0;
    if (!left) return false;
    counts.set(letter, left - 1);
  }
  return word(answer).length >= 3;
}

export function validContent(p) {
  if (!p.letters || !p.validWords?.length || !p.targetWords?.length || !Array.isArray(p.bonusWords)) return false;
  const hasNext = Boolean(p.nextLetters);
  if (hasNext && (p.targetWords.length !== 2 || !Array.isArray(p.nextBonusWords))) return false;
  const onFirstRack = hasNext ? [p.targetWords[0], ...p.bonusWords] : p.validWords;
  const onNextRack = hasNext ? [p.targetWords[1], ...p.nextBonusWords] : [];
  const listed = [...onFirstRack, ...onNextRack];
  return p.targetWords.includes(p.keyWord)
    && p.targetWords.every((item) => listed.includes(item) && p.validWords.includes(word(item)))
    && onFirstRack.every((item) => canFormWord(p.letters, item))
    && onNextRack.every((item) => canFormWord(p.nextLetters, item))
    && (!hasNext || p.nextBonusWords.every(item => !p.targetWords.includes(item)))
    && p.bonusWords?.every((item) => p.validWords.includes(word(item)) && !p.targetWords.includes(word(item)))
    && p.choices?.filter((item) => item.correct).length === 1;
}

export function mount(root, p, ctx) {
  if (!validContent(p)) {
    root.innerHTML = '<p role="alert">This word garden needs a content check before it can be played.</p>';
    console.error(`Invalid Word Garden content: ${p.id}`);
    return;
  }
  // Opt-in local User Timing entries for playtests.
  const debug = new URLSearchParams(location.search).has('wg-debug');
  const started = performance.now();
  const mark = action => { if (debug) performance.mark('word-garden:' + p.id + ':' + action, { detail: { elapsed: performance.now() - started } }); };
  mark('ready');
  let interacted = false;
  const found = new Set(), selected = [];
  let letters = [...word(p.letters)], secondRack = false;
  const bonusMap = state.wordGarden?.bonusFound || (state.wordGarden = { bonusFound: {} }).bonusFound;
  const bonusFound = new Set(bonusMap[p.id] || []);
  let hintIndex = 0, answered = false, learning = false;
  let clearSparks;
  ctx.cleanup(() => clearSparks?.());
  let fx; // discovery effects; created once the rack exists
  ctx.cleanup(() => fx?.cleanup());
  const levelLabel = p.levelLabel || `Word Garden · Level ${p.levelNumber} of 10`;
  root.innerHTML = `<section class="word-garden"${p.adventure ? ` data-adventure="${p.adventure}"` : ''} aria-label="${esc(levelLabel)}">
    <header class="wg-heading">${p.adventure ? '' : `<p class="kicker">${esc(levelLabel)}</p>`}<h2>${esc(p.title)}</h2>
      ${p.adventure ? '' : `<p class="wg-objective">${esc(p.learningObjective)}</p>`}<p class="wg-clue">${esc(p.clue)}</p></header>
    ${gardenScene(p)}<div class="wg-play">
    <div class="wg-targets" role="list" aria-label="Words to discover"></div>
    <p class="wg-bonus-status" role="status" aria-live="polite"></p>
    <div class="wg-board"><svg class="wg-links" aria-hidden="true"><polyline></polyline></svg><div class="wg-rack" role="group" aria-label="Letter garden"></div></div>
    <p class="wg-current" role="status" aria-live="polite">Choose letters, then submit your word.</p>
    <div class="wg-actions"><button type="button" class="btn alt" data-clear>Clear</button><button type="button" class="btn alt" data-shuffle aria-label="Shuffle letters">Shuffle<span class="wg-label-extra"> letters</span></button><button type="button" class="btn big" data-submit>Find word</button></div>
    </div><div class="wg-discovery" hidden></div><div class="wg-question" hidden></div>
  </section>`;
  const targets = root.querySelector('.wg-targets'), rack = root.querySelector('.wg-rack');
  fx = createDiscoveryFeedback(rack);
  const idlePrompt = p.adventure ? 'Drag to connect, or tap letters.' : 'Choose letters, then submit your word.';
  const current = root.querySelector('.wg-current'), polyline = root.querySelector('.wg-links polyline');
  let order = letters.map((letter, index) => ({ letter, index }));

  function renderRack(effect = '') {
    rack.dataset.effect = effect;
    rack.innerHTML = order.map((tile, index) => {
      const angle = (Math.PI * 2 * index / order.length) - Math.PI / 2;
      const x = 50 + Math.cos(angle) * 35, y = 50 + Math.sin(angle) * 35;
      return `<button type="button" class="wg-letter" style="--x:${x}%;--y:${y}%" data-letter="${tile.index}" aria-label="Letter ${tile.letter}, tile ${index + 1} of ${order.length}" aria-pressed="${selected.includes(tile.index)}">${tile.letter}</button>`;
    }).join('');
    renderTargets();
    updatePath();
  }
  function renderTargets(discovered = '') {
    targets.innerHTML = p.targetWords.map((answer) => `<span role="listitem" class="wg-target ${found.has(word(answer)) ? 'found' : ''}${word(answer) === discovered ? ' just-found' : ''}" aria-label="${found.has(word(answer)) ? `${esc(answer)} found` : `Word to find, ${word(answer).length} letters`}">${found.has(word(answer)) ? esc(answer) : `<span aria-hidden="true">${'· '.repeat(word(answer).length).trim()}</span>`}</span>`).join('');
    root.querySelector('.wg-bonus-status').textContent = bonusFound.size ? `Bonus words found: ${[...bonusFound].join(', ')}` : '';
  }
  function updatePath(pointer) {
    const box = rack.getBoundingClientRect();
    if (!box.width || !box.height) return;
    const points = selected.map((id) => {
      const tile = rack.querySelector(`[data-letter="${id}"]`);
      if (!tile) return '';
      const rect = tile.getBoundingClientRect();
      return `${rect.left + rect.width / 2 - box.left},${rect.top + rect.height / 2 - box.top}`;
    }).filter(Boolean);
    for (const tile of rack.children) tile.setAttribute('aria-pressed', String(selected.includes(Number(tile.dataset.letter))));
    if (pointer && points.length) points.push(`${pointer.clientX - box.left},${pointer.clientY - box.top}`);
    const svg = root.querySelector('.wg-links');
    svg.setAttribute('viewBox', `0 0 ${box.width} ${box.height}`);
    polyline.setAttribute('points', points.join(' '));
    const text = selected.map((id) => letters[id]).join('');
    current.textContent = text || idlePrompt;
    current.dataset.feedback = '';
  }
  function choose(id) {
    if (selected.includes(id) || answered || learning) return;
    if (!interacted) { interacted = true; mark('first-letter'); }
    // Each letter sounds a step higher, so a word audibly builds toward its submit (capped to stay pleasant).
    selected.push(id); sfx('place', .35, Math.min(1 + (selected.length - 1) * .07, 1.42)); buzz(6); updatePath();
  }
  function clear() { selected.length = 0; updatePath(); }
  function tell(message, kind, mood) {
    current.textContent = message;
    current.dataset.feedback = kind;
    if (mood) reactInGarden(root, mood);
  }
  function recordBonus(answer) {
    if (bonusFound.has(answer)) return 'You already found that bonus word.';
    bonusFound.add(answer);
    state.wordGarden ||= { bonusFound: {} };
    state.wordGarden.bonusFound[p.id] = [...bonusFound]; save(); sfx('pluck2', .35, 1.15); buzz(8);
    return `Bonus discovery: ${answer}. ${bonusFound.size} unique bonus ${bonusFound.size === 1 ? 'word' : 'words'} found.`;
  }
  function revealKeyWord() {
    const box = root.querySelector('.wg-discovery');
    box.hidden = false;
    box.innerHTML = `${p.adventure ? '' : `<h3>${esc(p.keyWord)} opened a Scripture discovery</h3><p>${esc(p.keyDiscovery)}</p>`}${BibleVerse(p.ref, 'KJV', { puzzleSource: true, simple: state.level === 'child' })}`;
    wireBibleReaders(box);
  }
  function showRackClue() {
    ctx.clearFeedback();
    root.querySelector('.wg-clue').textContent = p.evidence.rackClue;
    const clue = root.querySelector('.wg-discovery');
    root.querySelector('.wg-play').before(clue);
    clue.hidden = false;
    clue.innerHTML = `<details class="wg-evidence-clue"><summary>Read ${esc(p.ref)} (KJV)</summary>
      <p>${esc(p.choices.map(choice => choice.text).join(' '))}</p></details>`;
  }
  function showQuestion() {
    const box = root.querySelector('.wg-question');
    if (p.adventure) {
      learning = true;
      if (p.evidence) root.querySelector('.wg-discovery').hidden = true;
      else revealKeyWord();
      root.querySelector('.wg-play').hidden = true;
    }
    box.hidden = false;
    if (p.evidence) {
      ctx.clearFeedback();
      root.querySelector('.wg-clue').hidden = true;
      box.classList.add('wg-evidence');
      box.dataset.ref = p.ref;
    }
    const citation = p.evidence ? `<p class="kicker" id="wg-evidence-reference">${esc(p.ref)} · KJV</p>` : '';
    box.innerHTML = `${citation}<h3 tabindex="-1">${esc(p.question)}</h3><div class="wg-choices">${p.choices.map((choice, index) => `<button type="button" class="wg-choice" data-choice="${index}">${esc(choice.text)}</button>`).join('')}</div><p class="wg-answer-feedback" aria-live="polite"></p>`;
    if (p.evidence) {
      const prompt = box.querySelector('h3');
      prompt.setAttribute('aria-describedby', 'wg-evidence-reference');
      prompt.focus();
    }
    else if (p.adventure) {
      const reading = root.querySelector('.wg-discovery');
      reading.tabIndex = -1;
      reading.setAttribute('role', 'region');
      reading.setAttribute('aria-label', 'Scripture discovery');
      reading.focus();
    }
    else box.querySelector('[data-choice]')?.focus({ preventScroll: true });
  }
  function submit() {
    if (answered || learning || !selected.length) return;
    const answer = selected.map(id => letters[id]).join('');
    if (answer.length < 3) return tell('Connect at least three letters.', 'retry');
    const picked = [...selected]; // captured so the tiles can react after the selection clears
    clear();
    if (found.has(answer) || (!p.targetWords.includes(answer) && bonusFound.has(answer))) return tell(`Already found: ${answer}`, 'repeat');
    const target = p.nextLetters ? p.targetWords[Number(secondRack)] === answer : p.targetWords.includes(answer);
    const bonuses = secondRack ? p.nextBonusWords : p.bonusWords;
    if (target) {
      mark('target');
      found.add(answer);
      const finale = found.size === p.targetWords.length;
      const tier = finale || answer === word(p.keyWord || '') ? 'key' : 'target';
      fx.tiles(picked, tier);
      renderTargets(answer);
      fx.fly(answer, targets.querySelector('.just-found'), tier);
      // Sound tiers match the visual tiers: a short chime for a word, the full jingle (which spans the flight) for the key word.
      if (tier === 'key') { sfx('found', .42); buzz([12, 60, 18]); } else { sfx('good', .4); buzz(14); }
      reactInGarden(root, tier === 'key' ? 'celebrating' : 'happy', found.size, 'target');
      if (p.adventure) {
        clearSparks?.();
        clearSparks = sparkBurst(root.querySelector('.wg-scene'), 3);
      }
      tell(`Found ${answer}!`, 'target');
      if (p.nextLetters && !secondRack) {
        const restoreFocus = rack.contains(document.activeElement);
        secondRack = true;
        letters = [...p.nextLetters];
        order = letters.map((letter, index) => ({ letter, index }));
        renderRack('cascade');
        hintIndex = 0;
        if (p.evidence) showRackClue();
        else root.querySelector('.wg-clue').textContent = 'Find the next word.';
        tell('WATER found. Fresh letters!', 'target', 'surprised');
        if (restoreFocus) rack.firstElementChild.focus();
      }
      if (!p.adventure && answer === p.keyWord) revealKeyWord();
      if (finale) {
        // Let the last word land before the Scripture step replaces the board; input is already closed.
        if (p.adventure) learning = true;
        fx.afterLanding(showQuestion);
      }
    } else if (bonuses.includes(answer)) {
      fx.tiles(picked, 'micro');
      tell(recordBonus(answer), 'bonus', 'surprised');
    } else {
      fx.tiles(picked, 'miss');
      mark('invalid');
      ctx.miss?.();
      sfx('oops', .28); buzz([8, 50, 8]);
      if (p.adventure) tell(`Try another word. ${answer} isn’t on this rack’s list.`, 'retry', 'encouraging');
      else ctx.say('That word is not in this level’s word list. Try another combination.', 'soft');
    }
  }
  function chooseAnswer(event) {
    const button = event.target.closest('[data-choice]');
    if (!button || answered) return;
    const choice = p.choices[Number(button.dataset.choice)];
    const feedback = root.querySelector('.wg-answer-feedback');
    if (!choice.correct) {
      ctx.miss?.(); feedback.textContent = p.evidence ? choice.feedback : `${choice.feedback} ${p.misconception}`;
      button.classList.add('incorrect'); sfx('oops', .35);
      if (!p.evidence) ctx.say(choice.feedback, 'soft');
      return;
    }
    mark('complete');
    answered = true; reactInGarden(root, 'celebrating', 3, 'complete'); feedback.textContent = choice.feedback;
    root.querySelectorAll('[data-choice]').forEach((item) => { item.disabled = true; });
    button.classList.add('correct'); sfx('solved', .4); ctx.solved(p.afterLearn);
  }
  const undo = () => { selected.pop(); updatePath(); };
  wireWheelPointer(rack, {
    choose, undo, selected, trace: updatePath, submit: p.adventure ? submit : undefined,
    cancel(before) { selected.splice(0, selected.length, ...before); updatePath(); },
  });
  root.addEventListener('click', (event) => {
    const button = event.target.closest('button');
    if (button?.matches('[data-submit]')) submit();
    else if (button?.matches('[data-clear]')) clear();
    else if (button?.matches('[data-shuffle]')) {
      order = shuffle(order); sfx('page', .3);
      // Preserve tile identity and focus; only their destinations change.
      order.forEach((tile, index) => {
        const angle = Math.PI * 2 * index / order.length - Math.PI / 2;
        const button = rack.querySelector(`[data-letter="${tile.index}"]`);
        button.style.setProperty('--x', `${50 + Math.cos(angle) * 35}%`);
        button.style.setProperty('--y', `${50 + Math.sin(angle) * 35}%`);
        button.setAttribute('aria-label', `Letter ${tile.letter}, tile ${index + 1} of ${order.length}`);
        rack.append(button);
      });
      updatePath();
    }
    chooseAnswer(event);
  });
  root.addEventListener('keydown', (event) => {
    if (!event.target.closest('.wg-play') || learning || answered) return;
    if (event.key === 'Backspace') { event.preventDefault(); undo(); }
    if (event.key === 'Escape') clear();
  });
  const onResize = () => updatePath();
  addEventListener('resize', onResize, { passive: true });
  ctx.cleanup(() => removeEventListener('resize', onResize));
  ctx.onHint(() => {
    mark('hint');
    if (learning) return ctx.say('Hint: Read the passage and look for the words that answer the question.', 'soft');
    if (secondRack && p.evidence) {
      const hints = p.evidence.hints;
      return ctx.say(`Hint: ${hints[Math.min(hintIndex++, hints.length - 1)]}`, 'soft');
    }
    const next = p.targetWords.find((item) => !found.has(word(item)));
    const extra = hintIndex++ > 0 && next ? ` The word is ${word(next)}.` : next ? ` The next word has ${word(next).length} letters.` : '';
    ctx.say(`Hint: ${p.hint}${extra}`, 'soft');
  });
  renderRack();
}
