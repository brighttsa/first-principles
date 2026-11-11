// Original cartoon vector scenes: bright sky, layered mountains, rolling hills, rivers, waterfall, flowers, trees.
// `adventureMap()` is the World 1 playable map: each lesson has a landmark (doorway, waterfall, garden, discovery
// tablets, open Bible). Landmark state (done / cur / lock) comes from real progress. No text is drawn in art.
import { worldOneHeroScene } from './world-1-unified-plate-scene.js';
import { worldTwoHeroScene } from './world-2-unified-plate-scene.js';
const DEFS = `<defs>
 <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4FB6F2"/><stop offset=".6" stop-color="#9CDCFF"/><stop offset="1" stop-color="#E4F6FF"/></linearGradient>
 <linearGradient id="mtn" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9A86F0"/><stop offset="1" stop-color="#6D63DB"/></linearGradient>
 <linearGradient id="mtn2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7FA8F7"/><stop offset="1" stop-color="#5A83E8"/></linearGradient>
 <linearGradient id="hill1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8BE67A"/><stop offset="1" stop-color="#4FC465"/></linearGradient>
 <linearGradient id="hill2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#58CC65"/><stop offset="1" stop-color="#33A857"/></linearGradient>
 <linearGradient id="water" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7BE8F7"/><stop offset="1" stop-color="#2DA8EA"/></linearGradient>
 <radialGradient id="glow"><stop offset="0" stop-color="#FFF6B0"/><stop offset=".6" stop-color="#FFD23F" stop-opacity=".7"/><stop offset="1" stop-color="#FFD23F" stop-opacity="0"/></radialGradient>
 <radialGradient id="crown" cx=".4" cy=".35"><stop offset="0" stop-color="#8BE67A"/><stop offset="1" stop-color="#3FB25A"/></radialGradient>
 <filter id="soft" x="-10%" y="-10%" width="120%" height="125%"><feDropShadow dx="0" dy="4" stdDeviation="3.5" flood-color="#24346A" flood-opacity=".22"/></filter></defs>`;

const cloud = (cls, x, y, s = 1) => `<g class="cloud ${cls}"><g transform="translate(${x} ${y}) scale(${s})"><path d="M0 30Q0 12 20 12Q26-6 48 4Q64-8 80 10Q102 8 102 30Z" fill="#fff"/><path d="M8 30h86" stroke="#D8EEFF" stroke-width="6" stroke-linecap="round"/></g></g>`;
const tree = (x, y, s = 1, cls = '', fruit = false) => `<g class="tree ${cls}" transform="translate(${x} ${y}) scale(${s})" filter="url(#soft)">
  <path d="M-6 0L-4-34h8L6 0Z" fill="#9A6A3F"/><circle cx="0" cy="-52" r="28" fill="url(#crown)"/><circle cx="-18" cy="-40" r="19" fill="#4FC465"/><circle cx="19" cy="-42" r="20" fill="#5FD36E"/>
  <circle cx="-6" cy="-62" r="11" fill="#A8F08F" opacity=".7"/>${fruit ? [[-14, -50], [10, -60], [18, -38], [-4, -34], [-24, -34]].map(([a, b]) => `<circle cx="${a}" cy="${b}" r="5.5" fill="#FF7185"/><circle cx="${a - 1.5}" cy="${b - 1.5}" r="1.6" fill="#fff" opacity=".8"/>`).join('') : ''}</g>`;
const flower = (x, y, c = '#FF7185', s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 0v13" stroke="#2E8B3C" stroke-width="2.4" stroke-linecap="round"/>${[0, 72, 144, 216, 288].map((a) => `<circle cx="${(Math.cos(a * Math.PI / 180) * 5.5).toFixed(1)}" cy="${(Math.sin(a * Math.PI / 180) * 5.5).toFixed(1)}" r="4.6" fill="${c}"/>`).join('')}<circle r="3.2" fill="#FFD23F"/></g>`;
const bfly = (x, y, c) => `<g class="bfly" transform="translate(${x} ${y})"><g class="wing"><ellipse cx="-5" cy="0" rx="6" ry="8" fill="${c}"/><ellipse cx="5" cy="0" rx="6" ry="8" fill="${c}"/></g><path d="M0-6v12" stroke="#24346A" stroke-width="2"/></g>`;
const bird = (cls, x, y) => `<g class="bird ${cls}"><path transform="translate(${x} ${y})" d="M0 0q6-9 12 0q6-9 12 0" fill="none" stroke="#24346A" stroke-width="2.4" stroke-linecap="round"/></g>`;
const flowers = (pts) => pts.map(([x, y, i]) => flower(x, y, ['#FF7185', '#FFD23F', '#FFFFFF', '#8661E8'][i % 4], .9 + (i % 3) * .15)).join('');
const mountains = (y) => `<path d="M-10 ${y + 70}L70 ${y - 40}L130 ${y + 20}L215 ${y - 70}L300 ${y + 10}L350 ${y - 30}L420 ${y + 50}V${y + 130}H-10Z" fill="url(#mtn)"/>
  <path d="M215 ${y - 70}l-24 26 14-4 10 12 10-12 14 4Z M70 ${y - 40}l-18 20 10-3 8 9 8-9 10 3Z" fill="#fff" opacity=".85"/>
  <path d="M-10 ${y + 100}L90 ${y + 20}L170 ${y + 80}L260 ${y + 10}L350 ${y + 80}L420 ${y + 30}V${y + 150}H-10Z" fill="url(#mtn2)"/>`;
const sunDisc = (x, y) => `<g class="sun" transform="translate(${x} ${y})"><circle r="80" fill="url(#glow)"/><circle r="30" fill="#FFD23F"/><circle r="22" fill="#FFE98A"/></g>`;

/** Hero scene for welcome / intro / completion (portrait, slice). */
export function sunriseScene(worldId = 1) {
  return worldId === 2 ? worldTwoHeroScene(true) : worldOneHeroScene();
}
export function sunriseSceneSvg() {
  return `<svg class="scene" viewBox="0 0 400 600" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${DEFS}
  <rect width="400" height="600" fill="url(#sky)"/><g class="px1">${sunDisc(300, 130)}${cloud('', 20, 90)}${cloud('c2', -60, 170, .8)}${bird('', 40, 140)}${bird('b2', 10, 200)}</g>
  <g class="px1">${mountains(280)}</g>
  <g class="px2" filter="url(#soft)"><path d="M-10 400Q100 340 220 390T410 370V620H-10Z" fill="url(#hill1)"/>${tree(70, 400, .6, 'b')}${tree(340, 392, .55)}</g>
  <g class="px2"><path d="M-10 470Q110 420 210 465T410 445V620H-10Z" fill="url(#hill2)"/>
    <path d="M185 450Q215 490 175 530T205 585T170 625H250Q285 585 245 555T265 520Q300 485 245 450Z" fill="url(#water)"/><path class="river-flow" d="M200 455Q230 492 192 530T220 585" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".7"/></g>
  <g class="px3" filter="url(#soft)"><path d="M-10 540Q70 495 160 555L170 620H-10Z" fill="#46BC5C"/><path d="M410 525Q330 490 262 550L255 620H410Z" fill="#4FC465"/>${tree(46, 535, 1)}${tree(356, 520, .9, 'b', true)}</g>
  <g class="px3">${flowers([[28, 585, 0], [75, 600, 1], [112, 584, 2], [330, 595, 3], [370, 580, 0], [300, 604, 1]])}${bfly(130, 500, '#8661E8')}${bfly(290, 520, '#FF7185')}</g></svg>`;
}

/* ---- World 1 adventure map: landmarks ---- */
const NODES = [[255, 392], [140, 600], [265, 890], [135, 1160], [240, 1405]];
export const MAP_NODES = NODES;

const doorway = (st) => `<g class="lm ${st}" transform="translate(255 282)"><ellipse class="glow" cx="0" cy="-5" rx="70" ry="64" fill="url(#glow)"/>
  <g filter="url(#soft)"><path d="M-40 40V-10a40 40 0 0 1 80 0V40Z" fill="#BFC8E6"/><path d="M-30 40V-8a30 30 0 0 1 60 0V40Z" fill="#FFF1A8"/><path d="M-30 40V-8a30 30 0 0 1 60 0" fill="none" stroke="#9AA6D4" stroke-width="3"/>
  <rect x="-48" y="-18" width="14" height="58" rx="5" fill="#A9B5DB"/><rect x="34" y="-18" width="14" height="58" rx="5" fill="#A9B5DB"/><path d="M-12-42h24l-4 12h-16Z" fill="#8661E8"/>
  <rect x="-44" y="40" width="88" height="9" rx="4" fill="#9AA6D4"/><rect x="-36" y="49" width="72" height="8" rx="4" fill="#B8C3E6"/></g></g>`;
const waterfall = (st) => `<g class="lm ${st}" transform="translate(70 520)"><g filter="url(#soft)"><path d="M-62 110V-20L-20-60 30-40 52-10V110Z" fill="#8A93C9"/><path d="M-30-30L10-50 40-20V110H-30Z" fill="#A4ACDA"/></g>
  <path d="M-18-32h38v128h-38Z" fill="url(#water)"/><path class="fall" d="M-8-30V94M2-30V94M12-30V94" stroke="#fff" stroke-width="3" stroke-dasharray="14 12" stroke-linecap="round" opacity=".75"/>
  <ellipse cx="2" cy="104" rx="56" ry="16" fill="url(#water)"/><ellipse cx="2" cy="104" rx="30" ry="7" fill="#fff" opacity=".45"/></g>
  <g class="lm ${st}"><path d="M70 640Q140 680 210 700T410 725" fill="none" stroke="#2DA8EA" stroke-width="26" stroke-linecap="round"/><path class="river-flow" d="M80 640Q150 678 215 698T400 724" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".7"/>
  <g transform="translate(190 696)" filter="url(#soft)"><rect x="-34" y="-12" width="68" height="24" rx="6" fill="#B9824E"/><path d="M-26-12v24M-9-12v24M9-12v24M26-12v24" stroke="#8A5A33" stroke-width="3"/></g></g>`;
const garden = (st) => `<g class="lm ${st}" transform="translate(265 830)"><ellipse cx="0" cy="40" rx="78" ry="26" fill="#8A5A33"/><ellipse cx="0" cy="34" rx="70" ry="21" fill="#A8703F"/>
  <g class="sway" filter="url(#soft)"><path d="M0 34V-26" stroke="#2E8B3C" stroke-width="7" stroke-linecap="round"/><path d="M0-6C-26-4-40-22-40-42c24 0 40 14 40 36Z" fill="#58CC65"/><path d="M0-22c24-2 38-16 40-34-22-1-38 12-40 34Z" fill="#8BE67A"/><circle cx="0" cy="-30" r="3" fill="#FFF"/></g>
  ${flowers([[-52, 30, 0], [-34, 40, 1], [38, 38, 3], [56, 30, 2], [-8, 44, 0]]).replace(/scale\(/g, 'scale(')}</g>
  <g class="lm ${st}" transform="translate(345 880)">${tree(0, 0, 1.15, 'b', true)}</g>`;
const tablets = (st) => `<g class="lm ${st}" transform="translate(135 1095)" filter="url(#soft)"><rect x="-70" y="-30" width="54" height="72" rx="14" fill="#C9D2EE"/><circle cx="-43" cy="-6" r="13" fill="#FFD23F"/>
  ${[0, 45, 90, 135, 180, 225, 270, 315].map((a) => `<path transform="rotate(${a} -43 -6)" d="M-43-24v-6" stroke="#FFD23F" stroke-width="3" stroke-linecap="round"/>`).join('')}<path d="M-56 22l26 0" stroke="#58CC65" stroke-width="5" stroke-linecap="round"/>
  <rect x="16" y="-30" width="54" height="72" rx="14" fill="#C9D2EE"/><path d="M26 6q4-10 12-8 6-8 14-2 8 0 8 8H26Z" fill="#8896C8"/><path d="M33 22l22 14M55 22L33 36" stroke="#FF7185" stroke-width="5" stroke-linecap="round"/>
  <path d="M-3 42v20" stroke="#9A6A3F" stroke-width="6" stroke-linecap="round"/><path d="M-3 24l26 8-26 8Z" fill="#8661E8"/><circle cx="-3" cy="22" r="4" fill="#fff"/></g>`;
const bible = (st) => `<g class="lm ${st}" transform="translate(240 1330)"><ellipse class="glow" cx="0" cy="0" rx="86" ry="60" fill="url(#glow)"/>
  <g filter="url(#soft)"><rect x="-58" y="34" width="116" height="16" rx="8" fill="#B8C3E6"/><rect x="-46" y="50" width="92" height="10" rx="5" fill="#9AA6D4"/>
  <path d="M0 30C-16 18-42 16-58 22V-24c16-6 42-4 58 8Z" fill="#fff"/><path d="M0 30c16-12 42-14 58-8V-24C42-30 16-28 0-16Z" fill="#F4F8FF"/><path d="M-58 22V-24L0-16V30Z" fill="none"/>
  <path d="M0-16V30" stroke="#C9D2EE" stroke-width="3"/><path d="M-48-8c12-2 28 0 40 6M-48 4c12-2 28 0 40 6M12-2c12-6 28-8 40-6M12 10c12-6 28-8 40-6" stroke="#8661E8" stroke-width="3" stroke-linecap="round" opacity=".6"/>
  <path d="M-62 26V-20" stroke="#6544C9" stroke-width="6" stroke-linecap="round"/><path d="M-60 28c20-8 44-8 60 4 16-12 40-12 60-4" fill="none" stroke="#6544C9" stroke-width="6" stroke-linecap="round"/></g></g>`;

/** states: ['done'|'cur'|'lock', x5] for [doorway, waterfall, garden, tablets, Bible]. */
export function adventureMap(states) {
  const [s1, s2, s3, s4, s5] = states;
  return `<svg class="scene map-art" viewBox="0 0 400 1500" preserveAspectRatio="xMidYMin meet" aria-hidden="true">${DEFS}
  <rect width="400" height="1500" fill="url(#sky)"/><g class="px1">${sunDisc(320, 120)}${cloud('', 10, 70)}${cloud('c2', -80, 150, .85)}${cloud('c3', 40, 250, .7)}${bird('', 60, 190)}${bird('b2', 20, 230)}</g>
  <g class="px1">${mountains(200)}</g>
  <path d="M-10 250Q90 195 210 245T410 225V1500H-10Z" fill="url(#hill1)"/>
  <path d="M-10 470Q100 420 210 465T410 445V1500H-10Z" fill="url(#hill2)" opacity=".55"/>
  <path d="M-10 760Q110 715 230 760T410 740V1500H-10Z" fill="url(#hill2)" opacity=".5"/>
  <path d="M-10 1060Q110 1015 230 1060T410 1040V1500H-10Z" fill="url(#hill2)" opacity=".5"/>
  <path d="M255 392C255 460 140 500 140 600S265 770 265 890 135 1040 135 1160 240 1290 240 1405" fill="none" stroke="#C99A5B" stroke-width="46" stroke-linecap="round"/>
  <path d="M255 392C255 460 140 500 140 600S265 770 265 890 135 1040 135 1160 240 1290 240 1405" fill="none" stroke="#F6E3B4" stroke-width="38" stroke-linecap="round"/>
  <path d="M255 392C255 460 140 500 140 600S265 770 265 890 135 1040 135 1160 240 1290 240 1405" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width="30" stroke-dasharray="3 22" stroke-linecap="round"/>
  ${waterfall(s2)}${doorway(s1)}${garden(s3)}${tablets(s4)}${bible(s5)}
  ${tree(48, 330, .9, 'b')}${tree(350, 520, .8)}${tree(40, 980, 1, '', true)}${tree(360, 1210, .85, 'b')}${tree(60, 1380, .8)}${tree(345, 1450, .7)}
  ${flowers([[30, 400, 0], [75, 470, 1], [330, 400, 2], [370, 640, 3], [300, 760, 0], [30, 800, 1], [370, 960, 2], [60, 1110, 3], [330, 1130, 0], [30, 1280, 1], [350, 1340, 2], [150, 1460, 0], [310, 1470, 3]])}
  ${bfly(190, 430, '#8661E8')}${bfly(320, 960, '#FF7185')}${bfly(90, 1260, '#FFD23F')}</svg>`;
}

// Each world paints its own garden plate. Plot coordinates mark the soil anchors in the uncropped 3:2 plate (percent of the frame):
// back row left to right, then front row left to right. The seed, sprout and bloom plants are shared by every garden.
const GARDENS = {
  // widths = pixel widths of garden-plate-small.webp and garden-plate.webp, so the browser picks the sharpest file for the screen.
  // sizes = plant width as a percent of the frame for the back row and the front row (each plate paints its beds at its own scale).
  1: { dir: 'assets/art/world-1-growth-garden', widths: [768, 1536], sizes: [15, 17], plots: [[22, 45.5], [50.4, 45.5], [78.7, 45.5], [19.6, 70], [50, 70], [80.8, 70]] },
  2: { dir: 'assets/art/world-2-growth-garden', widths: [768, 2528], sizes: [10.5, 13.5], plots: [[27.7, 43], [50.1, 43], [72.5, 43], [20.5, 60.5], [50.1, 60.5], [79.6, 60.5]] },
};
const PLANT_ART = 'assets/art/world-1-growth-garden';
const PLANT_NAMES = ['seed', 'sprout', 'bloom'];

export function gardenPlantSprite(stage, className = '', style = '') {
  const plant = PLANT_NAMES[stage];
  return `<img class="${className}" data-plant-stage="${plant}" src="${PLANT_ART}/plant-${plant}.webp"
    alt="" width="230" height="287" decoding="async" style="${style}">`;
}

export function gardenScene(plants, { preview = false, selectedPlot = -1, worldId = 1 } = {}) {
  const { dir: GARDEN_ART, plots: PLOTS, widths: [smallW, largeW], sizes: [backSize, frontSize] } = GARDENS[worldId];
  const grown = plants.filter(stage => stage === 2).length;
  const sprouting = plants.filter(stage => stage === 1).length;
  const sources = `srcset="${GARDEN_ART}/garden-plate-small.webp ${smallW}w, ${GARDEN_ART}/garden-plate.webp ${largeW}w"
    sizes="${preview ? '(min-width: 900px) 360px, calc(100vw - 32px)' : '(min-width: 1150px) 582px, (min-width: 1130px) 868px, (min-width: 900px) calc(100vw - 262px), calc(100vw - 32px)'}"`;
  const plots = PLOTS.map(([x, y], index) => gardenPlantSprite(plants[index], 'garden-plot',
    `--plot-x:${x}%;--plot-y:${y}%;--plot-size:${index < 3 ? backSize : frontSize}%`)).join('');
  const anchors = selectedPlot < 0 ? '' : PLOTS.map(([x, y], index) =>
    `<span class="garden-selected-plot" data-garden-anchor style="--plot-x:${x}%;--plot-y:${y}%"
      ${index === selectedPlot ? '' : 'hidden'}></span>`).join('');
  return `<div class="garden-painted-scene" role="img" aria-label="Growth Garden. ${grown} of ${plants.length} plants in bloom. ${sprouting} sprouting.">
    <img class="garden-plate" src="${GARDEN_ART}/garden-plate-small.webp" ${sources} alt="" width="768" height="512" decoding="async">
    ${anchors}${plots}</div>`;
}

export function gardenSceneSvg(plants, extras = {}) {
  const spots = [[70, 330], [160, 300], [250, 330], [340, 300], [110, 400], [290, 400]], cols = ['#FFD23F', '#FF7185', '#42B9F5', '#8661E8', '#FF7185', '#FFD23F'];
  const plant = (p, [x, y], i) => `<g transform="translate(${x} ${y})"><ellipse cx="0" cy="6" rx="24" ry="9" fill="#8A5A33"/>
    ${p >= 1 ? `<g class="tree b" style="animation-delay:${-i}s"><path d="M0 4V-28" stroke="#2E8B3C" stroke-width="5" stroke-linecap="round"/><path d="M0-10c-14 0-20-8-20-18 14 0 20 8 20 18Z" fill="#58CC65"/><path d="M0-18c14 0 18-8 18-16-13 0-18 6-18 16Z" fill="#8BE67A"/></g>` : '<circle r="4.5" fill="#5A3A26"/>'}
    ${p >= 2 ? `<g class="flower"><g transform="translate(0 -34)">${[0, 60, 120, 180, 240, 300].map((a) => `<circle cx="${(Math.cos(a * Math.PI / 180) * 9.5).toFixed(1)}" cy="${(Math.sin(a * Math.PI / 180) * 9.5).toFixed(1)}" r="8.5" fill="${cols[i]}"/>`).join('')}<circle r="6.5" fill="#FFF7D6"/></g></g>` : ''}</g>`;
  return `<svg class="scene" viewBox="0 0 400 520" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${DEFS}
  <rect width="400" height="520" fill="url(#sky)"/><g class="px1">${sunDisc(320, 80)}${cloud('', 30, 60, .8)}</g><g class="px1">${mountains(170)}</g>
  <path d="M-10 270Q100 235 210 268T410 255V530H-10Z" fill="url(#hill1)"/><path d="M-10 305Q100 280 210 303T410 292V530H-10Z" fill="url(#hill2)"/>
  ${extras.pond ? '<ellipse cx="200" cy="470" rx="92" ry="26" fill="url(#water)"/><path class="river-flow" d="M150 470h100" stroke="#fff" stroke-width="3" opacity=".6"/>' : ''}
  <g class="px3">${spots.map((s, i) => plant(plants[i] || 0, s, i)).join('')}${extras.butterfly ? bfly(200, 250, '#8661E8') : ''}${extras.path ? '<g fill="#F6E3B4"><ellipse cx="200" cy="440" rx="14" ry="7"/><ellipse cx="170" cy="420" rx="12" ry="6"/><ellipse cx="228" cy="418" rx="12" ry="6"/></g>' : ''}</g></svg>`;
}

/** Collectible World 1 bookplate: painted vignette (open Bible, sprout, glowing doorway). The title is HTML text beside it. */
/** The bookplate painting of a world: its own image when its content names one, otherwise World 1's original art. */
export function worldBookplateArt(world) {
  const image = world.bookplate.image;
  return image ? `<img class="bookplate-art" src="assets/art/${image}-440.webp" srcset="assets/art/${image}-440.webp 440w, assets/art/${image}-880.webp 880w" sizes="220px" width="440" height="329" alt="" decoding="async">` : bookplateArt();
}

export function bookplateArt() {
  return `<img class="bookplate-art" src="assets/art/world-1-bookplate/bookplate-440.webp" srcset="assets/art/world-1-bookplate/bookplate-440.webp 440w, assets/art/world-1-bookplate/bookplate-800.webp 800w" sizes="220px" width="440" height="329" alt="" decoding="async">`;
}
