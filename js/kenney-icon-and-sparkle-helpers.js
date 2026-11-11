// Kenney CC0 Game Icons and Particle Pack sprites, adapted to First Principles colours.
// Icons are white silhouettes tinted with CSS masks (so one file serves every colour and state);
// sparkles are small star/spark sprites tinted from the palette and thrown out from a point.
import { state } from './saved-progress-and-settings-state.js';

// CSS resolves custom-property URLs relative to the stylesheet, so build absolute URLs from this module.
const ASSETS = new URL('../assets/', import.meta.url).href;
export const icon = (name, cls = '') => `<span class="kic ${cls}" style="--m:url(${ASSETS}icons/${name}.png)" aria-hidden="true"></span>`;

/** Named icons used across the UI (nav, controls, status). */
export const icons = {
  map: icon('home'), daily: icon('star'), book: icon('menuList'), garden: icon('trophy'), medal: icon('medal1'), gear: icon('gear'),
  back: icon('arrowLeft'), close: icon('cross'), speaker: icon('audioOn'), bulb: icon('question'), lock: icon('locked'), check: icon('checkmark'), star: icon('star'),
};

const COLORS = ['#FFD23F', '#FF7185', '#42B9F5', '#8661E8', '#58CC65'];
const reduced = () => state.settings.motion === 'on' || (state.settings.motion === 'auto' && matchMedia('(prefers-reduced-motion: reduce)').matches);

/** Short celebratory burst of stars and sparks around an element (skipped when motion is reduced). */
export function sparkBurst(el, n = 9) {
  if (!el || reduced()) return;
  const r = el.getBoundingClientRect(), wrap = document.createElement('div'); wrap.className = 'sparks'; wrap.setAttribute('aria-hidden', 'true');
  wrap.style.cssText = `left:${r.left + r.width / 2}px;top:${r.top + r.height / 2}px`;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 + Math.random() * .6, d = 38 + Math.random() * 38, p = document.createElement('i');
    p.style.cssText = `--dx:${Math.cos(a) * d}px;--dy:${Math.sin(a) * d}px;--c:${COLORS[i % 5]};--m:url(${ASSETS}particles/${i % 2 ? 'star_01' : 'spark_01'}.png);--s:${14 + Math.random() * 12}px`;
    wrap.append(p);
  }
  document.body.append(wrap);
  const timeout = setTimeout(() => wrap.remove(), 900);
  return () => {
    clearTimeout(timeout);
    wrap.remove();
  };
}
