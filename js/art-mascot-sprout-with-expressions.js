// Sprig, the First Principles mascot, with a painted image for each expression.
const MOODS = { idle: 'idle', happy: 'happy', thinking: 'thinking', curious: 'thinking', pointing: 'pointing', encouraging: 'encouraging',
  celebrating: 'celebrating', cheer: 'celebrating', surprised: 'surprised' };
/** The painted mascot. Each mood selects its matching illustration. */
export const mascot = (mood = 'idle') => {
  const selected = Object.hasOwn(MOODS, mood) ? MOODS[mood] : 'idle';
  const src = new URL(`../assets/art/mascot-poses-v2/mascot-${selected}.webp`, import.meta.url).href;
  return `<img class="mascot mascot-img" data-mood="${selected}" src="${src}" alt="" width="180" height="233" decoding="async">`;
};

/** Kept for existing call sites: every companion name now resolves to Sprig. */
export const companion = (_name, mood = 'idle') => mascot(mood);
export const sprig = mascot;

const HOP_FRAMES = ['hop-crouch', 'hop-takeoff', 'hop-apex', 'hop-land'];
const BLINK_FRAMES = ['blink-half', 'blink-closed'];

export function guideMascot(mood, hop = false) {
  const motion = hop ? 'hop' : mood === 'happy' ? 'blink' : '';
  const frames = hop ? HOP_FRAMES : motion ? BLINK_FRAMES : [];
  return `<span class="sprig-guide-pose" data-sprig-motion="${motion}">
    ${mascot(mood)}
    ${frames.map(frame => `<img class="sprig-guide-frame" src="assets/art/mascot-poses-v2/mascot-${frame}.webp" alt="" width="400" height="466" decoding="async">`).join('')}
  </span>`;
}

/** Keep the still pose visible until every frame for the current reaction can paint. */
export async function prepareGuideMotion(guide) {
  const pose = guide.firstElementChild;
  const frames = pose.querySelectorAll('img');
  if (frames.length < 2) return;
  try {
    await Promise.all([...frames].map(frame => frame.decode()));
    if (pose.isConnected) pose.setAttribute('data-ready', '');
  } catch {
    // A failed frame load leaves the still pose visible.
  }
}
