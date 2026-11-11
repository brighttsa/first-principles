// Word Builder: tap, drag or type letters into slots. Tiles lift, compress and settle with spring easing.
// Wrong arrangements never punish: the player simply keeps rearranging. Hints lock one correct letter.
import { h, shuffle, rng, $ } from './core-utilities-and-dom-helpers.js';
import { sfx, buzz } from './sound-effects-music-narration-haptics.js';
import { state } from './saved-progress-and-settings-state.js';

export function mount(root, p, ctx) {
  const letters = [...p.answer];
  const extra = ctx.level === 'adult' ? [...'AEIRT'].filter((c) => !letters.includes(c)).slice(0, 2) : [];
  const tiles = [...letters, ...extra].map((c, i) => ({ id: i, c }));
  let order = shuffle(tiles, rng(p.answer.length * 97 + 13));
  if (order.slice(0, letters.length).map((t) => t.c).join('') === p.answer) order = order.reverse();
  const slots = Array(letters.length).fill(null);
  const locked = Array(letters.length).fill(false);
  let finished = false;

  root.innerHTML = `<p class="clue"></p><div class="slots" role="group" aria-label="Answer slots"></div>
    <div class="tray" role="group" aria-label="Letter tiles"></div><p class="kbd-tip">Tap, drag, or type the letters. Backspace removes one.</p>`;
  $('.clue', root).textContent = p.clue;
  const slotsEl = $('.slots', root), trayEl = $('.tray', root);

  const tileEl = (t) => h(`<button class="tile" data-id="${t.id}" aria-label="Letter ${t.c}">${t.c}</button>`);

  function render(settleId = null) {
    const active = document.activeElement;
    const activeId = root.contains(active) && active.matches('.tile') ? active.dataset.id : null;
    const wasInTray = trayEl.contains(active);
    slotsEl.innerHTML = ''; trayEl.innerHTML = '';
    slots.forEach((id, i) => {
      const s = h(`<div class="slot ${locked[i] ? 'locked' : ''}" data-i="${i}"></div>`);
      if (id !== null) {
        const t = tileEl(tiles[id]);
        t.setAttribute('aria-label', `Slot ${i + 1}, letter ${tiles[id].c}${locked[i] ? ', locked' : ', remove'}`);
        t.disabled = locked[i];
        if (id === settleId) t.classList.add('settle');
        s.append(t);
      }
      slotsEl.append(s);
    });
    const placed = new Set(slots);
    order.filter((t) => !placed.has(t.id)).forEach((t) => trayEl.append(tileEl(t)));
    if (activeId !== null) {
      const replacement = $(`.tile[data-id="${activeId}"]:enabled`, root);
      const next = wasInTray && replacement?.closest('.slot') ? $('.tile', trayEl) : replacement;
      (next || $('.tile', trayEl) || $('.slot .tile:enabled', slotsEl))?.focus({ preventScroll: true });
    }
  }

  const firstEmpty = () => slots.findIndex((s) => s === null);
  function place(id, i = firstEmpty()) {
    if (i < 0 || locked[i] || finished) return;
    const from = slots.indexOf(id); if (from >= 0) slots[from] = null; // lift from old slot
    slots[i] = id; // any displaced tile simply returns to the tray
    sfx('place', .5); buzz(8); render(id); check();
  }
  function unplace(i) {
    if (locked[i] || slots[i] === null || finished) return;
    slots[i] = null; sfx('unplace', .4); render();
  }
  function check() {
    if (slots.some((s) => s === null)) return;
    if (slots.map((id) => tiles[id].c).join('') === p.answer) {
      finished = true; slotsEl.classList.add('win'); slotsEl.querySelectorAll('.slot').forEach((s) => s.classList.add('ok'));
      ctx.solved(`"${p.answer}": you built it.`);
    } else {
      sfx('oops', .4);
      const motion = state.settings.motion;
      if (motion === 'off' || (motion === 'auto' && !matchMedia('(prefers-reduced-motion: reduce)').matches)) {
        slotsEl.animate([{ transform: 'translateX(-6px)' }, { transform: 'translateX(6px)' }, { transform: 'none' }], { duration: 300 });
      }
      ctx.miss?.(); ctx.say('Not quite yet. Try swapping some letters.', 'soft');
    }
  }

  // Pointer: tap places in first empty slot; drag drops onto the slot under the finger.
  root.addEventListener('pointerdown', (e) => {
    const t = e.target.closest('.tile:enabled'); if (!t || finished || e.button !== 0) return;
    const id = +t.dataset.id, inSlot = t.parentElement.classList.contains('slot');
    const sx = e.clientX, sy = e.clientY; let moved = false;
    t.setPointerCapture(e.pointerId);
    const move = (ev) => {
      const dx = ev.clientX - sx, dy = ev.clientY - sy;
      if (Math.hypot(dx, dy) > 6) { moved = true; t.classList.add('dragging'); }
      if (moved) t.style.translate = `${dx}px ${dy}px`;
    };
    const clearDrag = () => {
      t.removeEventListener('pointermove', move);
      t.removeEventListener('pointerup', up);
      t.removeEventListener('pointercancel', clearDrag);
      t.classList.remove('dragging'); t.style.translate = '';
    };
    const up = (ev) => {
      clearDrag();
      if (!moved) { inSlot ? unplace(slots.indexOf(id)) : place(id); return; }
      t.style.pointerEvents = 'none';
      const under = document.elementFromPoint(ev.clientX, ev.clientY)?.closest('.slot');
      t.style.pointerEvents = '';
      if (under) place(id, +under.dataset.i);
      else if (inSlot) unplace(slots.indexOf(id)); else render();
    };
    t.addEventListener('pointermove', move);
    t.addEventListener('pointerup', up);
    t.addEventListener('pointercancel', clearDrag);
  });
  // Keyboard and assistive activation use the native button click. Pointer gestures are handled above.
  root.addEventListener('click', (e) => {
    const tile = e.target.closest('.tile:enabled');
    if (!tile || e.detail !== 0) return;
    const id = +tile.dataset.id;
    slots.includes(id) ? unplace(slots.indexOf(id)) : place(id);
  });
  const onKey = (e) => {
    if (finished || e.ctrlKey || e.metaKey || e.target.matches?.('textarea,input')) return;
    if (e.key === 'Backspace') { for (let i = slots.length - 1; i >= 0; i--) if (slots[i] !== null && !locked[i]) { unplace(i); break; } return; }
    if (/^[a-z]$/i.test(e.key)) {
      const t = order.find((x) => !slots.includes(x.id) && x.c === e.key.toUpperCase());
      if (t) place(t.id);
    }
  };
  document.addEventListener('keydown', onKey);
  ctx.cleanup(() => document.removeEventListener('keydown', onKey));

  ctx.onHint(() => {
    if (finished) return;
    const i = slots.findIndex((id, k) => id === null || tiles[id].c !== letters[k]);
    if (i < 0) return;
    const want = tiles.find((t) => t.c === letters[i] && (!slots.includes(t.id) || !locked[slots.indexOf(t.id)]) && slots.indexOf(t.id) !== i);
    if (!want) return;
    const cur = slots[i]; const from = slots.indexOf(want.id);
    if (from >= 0) slots[from] = cur; // swap displaced tile back
    slots[i] = want.id; locked[i] = true; sfx('pluck', .5); render(want.id); check();
    ctx.say(`Hint: letter ${i + 1} is ${letters[i]}.`, 'soft');
  });
  render();
}
