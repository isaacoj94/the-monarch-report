'use client';

import { useEffect } from 'react';

const TAB_KEY = 'mr_screening_tab';
const HIDDEN_LIMIT_MS = 30 * 60_000;

export function markViewerSession() {
  try {
    sessionStorage.setItem(TAB_KEY, '1');
  } catch {
    // Private mode can block storage. The next visit will simply re-auth.
  }
}

export function clearViewerSession() {
  try {
    sessionStorage.removeItem(TAB_KEY);
  } catch {
    // ignore
  }
}

export function ViewerSessionGuard({ endSession }: { endSession: () => Promise<void> }) {
  useEffect(() => {
    let closing = false;
    let tabAlive = false;
    try {
      tabAlive = sessionStorage.getItem(TAB_KEY) === '1';
    } catch {
      tabAlive = false;
    }

    if (!tabAlive) {
      closing = true;
      clearViewerSession();
      void endSession();
      return;
    }

    markViewerSession();

    let hiddenSince = document.visibilityState === 'hidden' ? Date.now() : 0;
    const onVisibility = () => {
      if (document.visibilityState === 'hidden') hiddenSince = Date.now();
      else hiddenSince = 0;
    };
    const hiddenId = window.setInterval(() => {
      if (!hiddenSince || closing) return;
      if (Date.now() - hiddenSince >= HIDDEN_LIMIT_MS) {
        closing = true;
        clearViewerSession();
        void endSession();
      }
    }, 15_000);

    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      window.clearInterval(hiddenId);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [endSession]);

  return null;
}
