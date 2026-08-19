'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { Locale } from '@/lib/translations';

type LocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);
const localeLabels: Record<Locale, string> = { en: 'EN', ko: '한국어', ja: '日本語' };

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en');

  useEffect(() => {
    const stored = window.localStorage.getItem('tm-locale');
    if (stored !== 'en' && stored !== 'ko' && stored !== 'ja') return;
    const restoreLocale = window.setTimeout(() => setLocaleState(stored), 0);
    return () => window.clearTimeout(restoreLocale);
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const value = useMemo<LocaleContextValue>(() => ({
    locale,
    setLocale: (nextLocale) => {
      setLocaleState(nextLocale);
      window.localStorage.setItem('tm-locale', nextLocale);
    },
  }), [locale]);

  return (
    <LocaleContext.Provider value={value}>
      {children}
      <div className="tm-language-switcher" role="group" aria-label="Site language">
        {(Object.keys(localeLabels) as Locale[]).map((language) => (
          <button
            type="button"
            key={language}
            aria-pressed={locale === language}
            onClick={() => value.setLocale(language)}
          >
            {localeLabels[language]}
          </button>
        ))}
      </div>
    </LocaleContext.Provider>
  );
}

export function useLocale(): LocaleContextValue {
  const context = useContext(LocaleContext);
  if (!context) throw new Error('useLocale must be used inside LocaleProvider');
  return context;
}
