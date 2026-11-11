// Word Search: a seeded generator places every word (so each grid is always solvable) and checks selections.
// Difficulty by level: child = across/down, teen = adds diagonals, adult = adds backwards words.
// Select by dragging, or choose the first and last letters with taps or the keyboard.
import { h, rng, $ } from './core-utilities-and-dom-helpers.js';
import { sfx, buzz } from './sound-effects-music-narration-haptics.js';

const DIRS = { child: [[1, 0], [0, 1]], teen: [[1, 0], [0, 1], [1, 1]], adult: [[1, 0], [0, 1], [1, 1], [-1, 0], [-1, 1]] };

function build(words, size, dirs, seed) {
  const r = rng(seed), g = Array.from({ length: size }, () => Array(size).fill('')), placed = {};
  [...words].sort((a, b) => b.length - a.length).forEach((w) => {
    for (let tries = 0; tries < 400; tries++) {
      const [dx, dy] = dirs[Math.floor(r() * dirs.length)], x = Math.floor(r() * size), y = Math.floor(r() * size);
      const ex = x + dx * (w.length - 1), ey = y + dy * (w.length - 1);
      if (ex < 0 || ex >= size || ey < 0 || ey >= size) continue;
      if ([...w].every((c, k) => !g[y + dy * k][x + dx * k] || g[y + dy * k][x + dx * k] === c)) {
        [...w].forEach((c, k) => { g[y + dy * k][x + dx * k] = c; }); placed[w] = [x, y, dx, dy]; return;
      }
    }
    throw new Error('word search placement failed');
  });
  const abc = 'ABCDEFGHIJKLMNOPRSTUVWY';
  g.forEach((row) => row.forEach((_, i) => { if (!row[i]) row[i] = abc[Math.floor(r() * abc.length)]; }));
  return { g, placed };
}

export function mount(root, p, ctx) {
  const size = ctx.level === 'child' ? 8 : 9;
  let data; for (let s = 0; s < 20; s++) { try { data = build(p.words, size, DIRS[ctx.level], p.seed + s); break; } catch { /* retry next seed */ } }
  const { g, placed } = data, found = {}; let start = null, finished = false;

  root.innerHTML = `<p class="clue">Choose the first and last letters of each word. On a keyboard, use the arrow keys and Enter.</p><div class="ws" role="group" aria-label="Word search letters" style="grid-template-columns:repeat(${size},1fr)"></div><div class="words"></div>`;
  const grid = $('.ws', root), list = $('.words', root);
  g.forEach((row, y) => row.forEach((c, x) => grid.append(h(`<button data-x="${x}" data-y="${y}" tabindex="${x === 0 && y === 0 ? 0 : -1}" aria-label="${c}, row ${y + 1} column ${x + 1}" aria-pressed="false">${c}</button>`))));
  const cell = (x, y) => $(`[data-x="${x}"][data-y="${y}"]`, grid);
  function focusCell(target) {
    $('[tabindex="0"]', grid).tabIndex = -1;
    target.tabIndex = 0; target.focus();
  }
  const paintList = () => { list.innerHTML = ''; p.words.forEach((w) => list.append(h(`<span class="pill ${found[w] !== undefined ? 'found' : ''}">${w}</span>`))); };

  function select(a, b) {
    const dx = Math.sign(b.x - a.x), dy = Math.sign(b.y - a.y), len = Math.max(Math.abs(b.x - a.x), Math.abs(b.y - a.y)) + 1;
    if ((b.x - a.x) && (b.y - a.y) && Math.abs(b.x - a.x) !== Math.abs(b.y - a.y)) return false;
    const cells = Array.from({ length: len }, (_, k) => [a.x + dx * k, a.y + dy * k]), str = cells.map(([x, y]) => g[y][x]).join('');
    const w = p.words.find((q) => found[q] === undefined && (q === str || q === [...str].reverse().join('')));
    if (!w) return false;
    found[w] = Object.keys(found).length; cells.forEach(([x, y]) => cell(x, y).classList.add('found', 'f' + (found[w] % 5)));
    sfx('good', .5); buzz(15); paintList();
    if (Object.keys(found).length === p.words.length) { finished = true; ctx.solved('You found every word.'); }
    else ctx.say(`Found "${w}"! ${p.words.length - Object.keys(found).length} to go.`, 'good');
    return true;
  }
  const clearStart = () => {
    if (!start) return;
    const selected = cell(start.x, start.y);
    selected.classList.remove('start'); selected.setAttribute('aria-pressed', 'false'); start = null;
  };
  function pick(x, y) {
    if (finished) return;
    if (!start) {
      start = { x, y }; const selected = cell(x, y);
      selected.classList.add('start'); selected.setAttribute('aria-pressed', 'true'); sfx('tap', .35); return;
    }
    if (start.x === x && start.y === y) return clearStart();
    const ok = select(start, { x, y }); clearStart();
    if (!ok) { sfx('oops', .3); ctx.miss?.(); ctx.say('Not a hidden word. Try another line.', 'soft'); }
  }
  let gesture = null;
  grid.addEventListener('pointerdown', (e) => {
    const c = e.target.closest('button');
    if (!c || finished || !e.isPrimary || e.button !== 0) return;
    const x = +c.dataset.x, y = +c.dataset.y;
    gesture = { id: e.pointerId, hadStart: Boolean(start), x, y };
    grid.setPointerCapture(e.pointerId);
    if (!start) pick(x, y);
  });
  grid.addEventListener('pointerup', (e) => {
    if (gesture?.id !== e.pointerId) return;
    const { hadStart, x, y } = gesture; gesture = null;
    const target = document.elementFromPoint(e.clientX, e.clientY)?.closest('.ws button');
    if (!target || !grid.contains(target)) return;
    const endX = +target.dataset.x, endY = +target.dataset.y;
    if (hadStart || endX !== x || endY !== y) pick(endX, endY);
  });
  grid.addEventListener('pointercancel', () => { gesture = null; clearStart(); });
  grid.addEventListener('click', (e) => {
    const target = e.target.closest('button');
    if (target && e.detail === 0) pick(+target.dataset.x, +target.dataset.y);
  });
  grid.addEventListener('keydown', (e) => {
    const c = e.target.closest('button');
    if (!c) return;
    if (e.key === 'Escape' && start) { e.preventDefault(); clearStart(); return; }
    const directions = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] };
    const direction = directions[e.key];
    if (!direction) return;
    e.preventDefault();
    const next = cell(+c.dataset.x + direction[0], +c.dataset.y + direction[1]);
    if (next) focusCell(next);
  });
  ctx.onHint(() => {
    const w = p.words.find((q) => found[q] === undefined); if (!w) return;
    const [x, y] = placed[w]; const c = cell(x, y); c.classList.add('hint'); setTimeout(() => c.classList.remove('hint'), 2200);
    ctx.say(`Hint: "${w}" starts at row ${y + 1}, column ${x + 1}.`, 'soft');
  });
  paintList();
}
