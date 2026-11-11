// Paint order is independent of gameplay. A world can omit slots until its art is ready.
const PLANES = ['sky', 'distance', 'landscape', 'terrain', 'vegetation', 'props', 'particles'];
export function environmentMarkup({ art, planes, fog, heading = '', guide, landmarks, mastered }) {
  const scenery = PLANES.filter(name => planes[name]).map(name =>
    `<div class="world-plane" data-plane="${name}">${planes[name]}</div>`).join('');
  return `<div class="map-wrap living-world" data-mastered="${mastered}">
    <div class="world-scenery" aria-hidden="true">${art}${scenery}</div>
    ${fog}
    <div class="world-guide" data-world-watch aria-hidden="true">${guide}</div>
    ${heading}
    ${landmarks}
  </div>`;
}

export function mountEnvironment(scene) {
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  const canMove = () => {
    const setting = document.documentElement.dataset.motion;
    return setting !== 'reduced' && !(setting === 'auto' && preference.matches);
  };
  function sync() {
    scene.toggleAttribute('data-world-paused', !canMove() || document.hidden);
  }
  document.addEventListener('visibilitychange', sync);
  preference.addEventListener('change', sync);
  const observer = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
    for (const entry of entries) entry.target.toggleAttribute('data-world-offscreen', !entry.isIntersecting);
  }) : null;
  for (const prop of scene.querySelectorAll('[data-world-watch]')) observer?.observe(prop);
  sync();

  return {
    canMove,
    goTo(marker, animate) {
      marker.focus({ preventScroll: true });
      marker.scrollIntoView({ block: 'center', inline: 'nearest', behavior: animate && canMove() ? 'smooth' : 'instant' });
    },
    destroy() {
      observer?.disconnect();
      document.removeEventListener('visibilitychange', sync);
      preference.removeEventListener('change', sync);
    },
  };
}
