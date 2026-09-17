import { useEffect, useRef } from 'react';

export function useLiveRefresh(refresh, intervalMs = 10000) {
  const callbackRef = useRef(refresh);
  callbackRef.current = refresh;

  useEffect(() => {
    let active = true;
    const tick = async () => {
      if (!active || document.visibilityState !== 'visible') return;
      try {
        await callbackRef.current();
      } catch {
        // Polling failures stay silent; the initial load reports user-facing errors.
      }
    };

    const timer = window.setInterval(tick, intervalMs);
    const onVisible = () => {
      if (document.visibilityState === 'visible') tick();
    };
    document.addEventListener('visibilitychange', onVisible);

    return () => {
      active = false;
      window.clearInterval(timer);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [intervalMs]);
}
