import { useEffect, useRef, useCallback } from 'react';

const INACTIVITY_MS = 5 * 60 * 1000; // 5 minutes

/**
 * Calls `onExpire` after INACTIVITY_MS of no user interaction.
 * Resets on: mousemove, keydown, scroll, touchstart, click.
 * Only runs when `active` is true (i.e. admin is authenticated).
 */
export function useInactivity(onExpire, active) {
  const timerRef    = useRef(null);
  const onExpireRef = useRef(onExpire);

  // Keep ref fresh without re-subscribing events
  useEffect(() => { onExpireRef.current = onExpire; }, [onExpire]);

  const reset = useCallback(() => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => onExpireRef.current(), INACTIVITY_MS);
  }, []);

  useEffect(() => {
    if (!active) {
      clearTimeout(timerRef.current);
      return;
    }

    const events = ['mousemove', 'keydown', 'scroll', 'touchstart', 'click'];
    events.forEach(e => window.addEventListener(e, reset, { passive: true }));
    reset(); // start timer immediately

    return () => {
      clearTimeout(timerRef.current);
      events.forEach(e => window.removeEventListener(e, reset));
    };
  }, [active, reset]);
}