// Shared UI chrome: nav (bottom tabs on phones, top bar on desktop), screen top bar, modal sheet, paper confetti.
import { h, $ } from './core-utilities-and-dom-helpers.js';
import { icons } from './kenney-icon-and-sparkle-helpers.js';
import { mascot } from './art-mascot-sprout-with-expressions.js';
import { state } from './saved-progress-and-settings-state.js';
import { sfx } from './sound-effects-music-narration-haptics.js';

const TABS = [['map', 'Learn', icons.map], ['daily', 'Daily', icons.daily], ['library', 'Library', icons.book], ['progress', 'Progress', icons.garden], ['achievements', 'Achievements', icons.medal, 'desk'], ['settings', 'Settings', icons.gear]];

export function renderNav(current, go) {
  const nav = $('#nav');
  nav.innerHTML = `<div class="nav-brand"><span class="brand-mark">${mascot('happy')}</span><span class="brand-name">FIRST<br>PRINCIPLES</span></div>` + TABS.map(([id, label, ic, cls = '']) =>
    `<button class="nav-i ${cls}" data-go="${id}" ${current === id ? 'aria-current="page"' : ''}>${ic}<span>${label}</span></button>`).join('');
  nav.onclick = (e) => { const b = e.target.closest('[data-go]'); if (b) { sfx('tap', .4); go(b.dataset.go); } };
  nav.classList.toggle('hide', current === 'welcome');
}

export function topbar(title, { back, right = '', heading: asHeading = true } = {}) {
  // The screen title is the page's h1. A title that already carries its own h1 (the garden), or a screen whose content has its
  // own h1 (asHeading: false), is left alone so each page keeps exactly one.
  const heading = !asHeading || String(title).includes('<h1') ? '' : ' role="heading" aria-level="1"';
  return `<header class="topbar">${back ? `<button class="iconbtn" data-back aria-label="Back">${icons.back}</button>` : ''}<div class="title"${heading}>${title}</div>${right}</header>`;
}

export function openSheet(html) {
  const opener = document.activeElement;
  const dialog = h(`<dialog class="game-modal" aria-labelledby="game-modal-title">${html}</dialog>`);
  dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener('close', () => {
    dialog.remove();
    if (opener?.isConnected) opener.focus({ preventScroll: true });
    sfx('close', .4);
  }, { once: true });
  document.body.append(dialog);
  dialog.showModal(); sfx('open', .4);
  (dialog.querySelector('[data-modal-cancel]') || dialog.querySelector('button, input, select'))?.focus();
  return { el: dialog, close: () => { if (dialog.open) dialog.close(); } };
}

/** Restrained paper confetti in the signature palette. Skipped when motion is reduced. */
export function confetti(n = 36) {
  const reduce = state.settings.motion === 'on' || (state.settings.motion === 'auto' && matchMedia('(prefers-reduced-motion: reduce)').matches);
  if (reduce) return;
  const wrap = h('<div class="confetti" aria-hidden="true"></div>'), cols = ['#FFD23F', '#FF7185', '#42B9F5', '#8661E8', '#58CC65', '#FFFDF7'];
  for (let i = 0; i < n; i++) {
    const p = document.createElement('i');
    p.style.cssText = `left:${Math.random() * 100}vw;background:${cols[i % 6]};animation-duration:${1.6 + Math.random() * 1.4}s;animation-delay:${Math.random() * .5}s;transform:rotate(${Math.random() * 90}deg)`;
    wrap.append(p);
  }
  document.body.append(wrap); setTimeout(() => wrap.remove(), 3600);
}
