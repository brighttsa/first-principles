// Sprig: the one recurring guide character. Plus the six world glyphs and UI icons. All inline SVG, consistent 3px ink line.
export { sprig } from './art-mascot-sprout-with-expressions.js';

const S = 'fill="none" stroke="#203D36" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"';
export const glyphs = {
  1: `<svg viewBox="0 0 40 40"><path d="M20 34V18" ${S}/><path d="M20 20C10 20 6 14 6 8c8 0 14 3 14 12Z" fill="#78B96A" stroke="#203D36" stroke-width="3" stroke-linejoin="round"/><path d="M20 24c8 0 12-5 12-11-8 0-12 4-12 11Z" fill="#9BD08C" stroke="#203D36" stroke-width="3" stroke-linejoin="round"/></svg>`,
  2: `<svg viewBox="0 0 40 40"><path d="M5 14h20a5 5 0 1 0-5-5M5 22h26a5 5 0 1 1-5 5M5 30h12" ${S}/></svg>`,
  3: `<svg viewBox="0 0 40 40"><path d="M20 5C12 16 8 21 8 26a12 12 0 0 0 24 0c0-5-4-10-12-21Z" fill="#37B9B0" stroke="#203D36" stroke-width="3" stroke-linejoin="round"/></svg>`,
  4: `<svg viewBox="0 0 40 40"><path d="M7 35V19a13 13 0 0 1 26 0v16M7 35h26M20 22v13" ${S}/></svg>`,
  5: `<svg viewBox="0 0 40 40"><path d="M20 4v33M20 9h13l4 4-4 4H20M20 22H8l-4 4 4 4h12" ${S}/></svg>`,
  6: `<svg viewBox="0 0 40 40"><path d="M5 20 20 7l15 13M9 18v17h22V18M17 35V25h6v10" ${S}/></svg>`,
};
export { icons } from './kenney-icon-and-sparkle-helpers.js';
