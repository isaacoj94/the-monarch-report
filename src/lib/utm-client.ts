'use client';

// Captures utm_* on first landing into sessionStorage so the value survives
// in-site navigation between landing and a conversion (newsletter signup,
// outbound click). Server code never sees this — it's posted explicitly by
// the form handler.

const KEY = 'tm-utm';

export type UtmPayload = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
};

const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content'] as const;

export function captureUtms(): UtmPayload {
  if (typeof window === 'undefined') return {};
  const url = new URL(window.location.href);
  const fromUrl: UtmPayload = {};
  for (const k of UTM_KEYS) {
    const v = url.searchParams.get(k);
    if (v) fromUrl[k] = v;
  }
  if (Object.keys(fromUrl).length > 0) {
    try { sessionStorage.setItem(KEY, JSON.stringify(fromUrl)); } catch {}
    return fromUrl;
  }
  try {
    const raw = sessionStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as UtmPayload;
  } catch {}
  return {};
}

type GtagFn = (...args: unknown[]) => void;

export function trackEvent(name: string, params: Record<string, unknown> = {}): void {
  if (typeof window === 'undefined') return;
  const gtag = (window as unknown as { gtag?: GtagFn }).gtag;
  if (typeof gtag === 'function') gtag('event', name, params);
}
