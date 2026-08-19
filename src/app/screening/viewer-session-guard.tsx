'use client';

import { useEffect } from 'react';

const TAB_KEY = 'mr_screening_tab';
const BEAT_KEY = 'mr_screening_beat';
const GRACE_MS = 60_000;
const HIDDEN_LIMIT_MS = 30 * 60_000;
const PULSE_MS = 10_000;

export function markViewerSession() {
  try {
    sessionStorage.setItem(TAB_KEY, '1');
    localStorage.setItem(BEAT_KEY, String(Date.now()));
  } catch {
    // Private mode can block storage. The next visit will simply re-auth.
  }
}

export function clearViewerSession() {
  try {
    sessionStorage.removeItem(TAB_KEY);
    localStorage.removeItem(BEAT_KEY);
  } catch {
    // ignore
  }
}

export function ViewerSessionGuard({ endSession }: { endSession: () => Promise<void> }) {
  useEffect(() => {
    let closing = false;
    const now = Date.now();
    let tabAlive = false;
    let lastBeat = 0;
    try {
      tabAlive = sessionStorage.getItem(TAB_KEY) === '1';
      lastBeat = Number(localStorage.getItem(BEAT_KEY) || 0);
    } catch {
      tabAlive = false;
    }

    const siblingAlive = lastBeat > 0 && now - lastBeat < GRACE_MS;
    if (!tabAlive && !siblingAlive) {
      closing = true;
      clearViewerSession();
      void endSession();
      return;
    }

    markViewerSession();

    const pulse = () => {
      try {
        localStorage.setItem(BEAT_KEY, String(Date.now()));
      } catch {
        // ignore
      }
    };
    const pulseId = window.setInterval(pulse, PULSE_MS);

    let hiddenSince = document.visibilityState === 'hidden' ? Date.now() : 0;
    const onVisibility = () => {
      if (document.visibilityState === 'hidden') hiddenSince = Date.now();
      else {
        hiddenSince = 0;
        pulse();
      }
    };
    const hiddenId = window.setInterval(() => {
      if (!hiddenSince || closing) return;
      if (Date.now() - hiddenSince >= HIDDEN_LIMIT_MS) {
        closing = true;
        clearViewerSession();
        void endSession();
      }
    }, 15_000);

    const onPageHide = () => pulse();
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('pagehide', onPageHide);

    return () => {
      window.clearInterval(pulseId);
      window.clearInterval(hiddenId);
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('pagehide', onPageHide);
    };
  }, [endSession]);

  return null;
}
