// A world map as ONE painting. Gemini paints two plates per layout (portrait and landscape): the journey as it starts, and the
// same scene completed. The "started" plate is the map; around each landmark the "completed" plate is revealed when that lesson
// is done, so progress changes the world inside one picture instead of sticking separate sprites on top.
// Positions are percentages of the map frame. Each world supplies its plate folder and its landmark reveal ellipses.

/**
 * @param dir       plate folder, e.g. 'assets/art/world-1-plates'
 * @param landmarks landmark names in lesson order, with the review last
 * @param reveals   per landmark: [portrait ellipse, landscape ellipse], each [centre x, centre y, radius x, radius y] in percent
 * @param ambient   optional (states) => markup for the CSS-only ambient life layer drawn above the painting
 */
export function createUnifiedPlateScene({ dir, landmarks, reveals, ambient }) {
  // HD: the portrait plate ships at its native 1536 px width; the landscape plate ships at a normal and a retina size and the
  // browser picks by density on desktop. Tablet maps use the native landscape plate to keep at least two source pixels per CSS pixel.
  // Heroes (no map markers) keep their existing responsive source selection. Landscape phones (landscape, at most 500px
  // tall) get the landscape painting at any width, matching the landscape landmark coordinates in the map CSS.
  const plate = (state, hero = false, nativeHero = false) => `<picture class="wp-plate" data-plate="${state}">
  ${hero ? '' : `<source media="(768px <= width < 1100px), (orientation: landscape) and (max-height: 500px) and (width < 1100px)" srcset="${dir}/landscape-${state}-2752.webp">`}
  <source media="${hero ? '(min-width: 700px) and (orientation: landscape), (orientation: landscape) and (max-height: 500px)' : '(min-width: 1100px)'}" srcset="${!hero || nativeHero ? `${dir}/landscape-${state}-2752.webp` : `${dir}/landscape-${state}-1400.webp 1400w, ${dir}/landscape-${state}-2752.webp 2752w`}" sizes="100vw">
  <img src="${dir}/portrait-${state}-1536.webp" alt="" decoding="async"${state === 'early' ? ' fetchpriority="high"' : ''}></picture>`;

  const reveal = (name, state) => {
    const [[px, py, prx, pry], [lx, ly, lrx, lry]] = reveals[name];
    if (!prx || state !== 'done') return '';
    return `<div class="wp-reveal" data-landmark="${name}" data-state="${state}"
    style="--cx:${px}%;--cy:${py}%;--rx:${prx}%;--ry:${pry}%;--lcx:${lx}%;--lcy:${ly}%;--lrx:${lrx}%;--lry:${lry}%">${plate('complete')}</div>`;
  };

  return {
    /** states = one entry per landmark as 'done' | 'cur' | 'lock'. Returns the art slot and the planes for the renderer. */
    scene: (states) => ({ art: plate('early'), planes: { particles: ambient?.(states), props: landmarks.map((name, i) => reveal(name, states[i])).join('') } }),
    /** Calm backdrop for the welcome, chapter introduction and chapter complete screens. */
    hero: (native = false) => `<div class="scene wp-hero${native ? ' wp-hero-hd' : ''}" role="presentation">${plate('early', true, native)}</div>`,
  };
}
