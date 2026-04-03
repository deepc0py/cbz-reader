export interface GestureCallbacks {
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
}

const SWIPE_THRESHOLD = 80;
const RESET_DELAY_MS = 200;

/**
 * Attaches trackpad swipe detection to an element via wheel events.
 * macOS trackpad two-finger horizontal swipe fires wheel events with deltaX.
 * We accumulate deltaX and trigger page turns when the threshold is exceeded.
 */
export function attachTrackpadGestures(
  el: HTMLElement,
  callbacks: GestureCallbacks,
): () => void {
  let accumulatedX = 0;
  let resetTimer: ReturnType<typeof setTimeout> | null = null;
  let locked = false;

  function reset() {
    accumulatedX = 0;
    locked = false;
  }

  function onWheel(e: WheelEvent) {
    // Don't interfere with pinch-to-zoom (ctrl+wheel in Chrome)
    if (e.ctrlKey) return;

    // Only care about horizontal scroll (trackpad swipe)
    if (Math.abs(e.deltaX) < Math.abs(e.deltaY) * 0.5) return;

    e.preventDefault();

    if (locked) return;

    accumulatedX += e.deltaX;

    if (resetTimer) clearTimeout(resetTimer);
    resetTimer = setTimeout(reset, RESET_DELAY_MS);

    if (accumulatedX > SWIPE_THRESHOLD) {
      locked = true;
      callbacks.onSwipeLeft();
      if (resetTimer) clearTimeout(resetTimer);
      setTimeout(reset, 400);
    } else if (accumulatedX < -SWIPE_THRESHOLD) {
      locked = true;
      callbacks.onSwipeRight();
      if (resetTimer) clearTimeout(resetTimer);
      setTimeout(reset, 400);
    }
  }

  el.addEventListener('wheel', onWheel, { passive: false });

  return () => {
    el.removeEventListener('wheel', onWheel);
    if (resetTimer) clearTimeout(resetTimer);
  };
}
