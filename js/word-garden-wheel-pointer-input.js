// Capture drags on the rack so a swipe can cross empty space between tiles.
export function wireWheelPointer(rack, { choose, undo, submit, cancel, selected, trace }) {
  let gesture;
  function hit(x, y) {
    const tile = document.elementFromPoint(x, y)?.closest('[data-letter]');
    return rack.contains(tile) ? Number(tile.dataset.letter) : null;
  }
  rack.addEventListener('pointerdown', (event) => {
    const tile = event.target.closest('[data-letter]');
    if (!tile || !event.isPrimary || event.button !== 0 || gesture) return;
    event.preventDefault();
    gesture = { id: event.pointerId, x: event.clientX, y: event.clientY, dragged: false, before: [...selected] };
    rack.setPointerCapture(event.pointerId);
    choose(Number(tile.dataset.letter));
  });
  rack.addEventListener('pointermove', (event) => {
    if (gesture?.id !== event.pointerId) return;
    gesture.dragged ||= Math.hypot(event.clientX - gesture.x, event.clientY - gesture.y) > 8;
    if (!gesture.dragged) return;
    const id = hit(event.clientX, event.clientY);
    if (id !== null) {
      if (selected.length > 1 && id === selected.at(-2)) undo();
      else choose(id);
    }
    trace(event);
  });
  rack.addEventListener('pointerup', (event) => {
    if (gesture?.id !== event.pointerId) return;
    const { dragged } = gesture;
    gesture = null;
    trace();
    if (dragged) submit?.();
  });
  function cancelGesture(event) {
    if (gesture?.id !== event.pointerId) return;
    const { before } = gesture;
    gesture = null;
    cancel(before);
  }
  rack.addEventListener('pointercancel', cancelGesture);
  rack.addEventListener('lostpointercapture', cancelGesture);
  // Assistive activation and keyboard clicks do not create a pointer gesture.
  rack.addEventListener('click', (event) => {
    const tile = event.target.closest('[data-letter]');
    if (tile && event.detail === 0) choose(Number(tile.dataset.letter));
  });
}
