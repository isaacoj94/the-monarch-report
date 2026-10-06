'use client';

import { useState } from 'react';
import type { Locale } from '@/lib/translations';
import styles from './documentary.module.css';

export type SubtitledVideo = {
  /** One upload per subtitle language (subtitles burned in). */
  perLanguage?: Partial<Record<Locale, string>>;
  /** One upload with caption tracks; the switch picks the track. */
  shared?: string;
};

const LANGUAGES: { id: Locale; label: string }[] = [
  { id: 'en', label: 'English' },
  { id: 'ja', label: '日本語' },
  { id: 'ko', label: '한국어' },
];

const SUBTITLES_LABEL: Record<Locale, string> = { en: 'Subtitles', ko: '자막', ja: '字幕' };

export function hasVideo(video: SubtitledVideo) {
  return Boolean(video.shared || Object.values(video.perLanguage ?? {}).some(Boolean));
}

function embedSrc(video: SubtitledVideo, lang: Locale) {
  const own = video.perLanguage?.[lang];
  if (own) return `https://www.youtube.com/embed/${own}?rel=0`;
  const id = video.shared ?? Object.values(video.perLanguage ?? {}).find(Boolean);
  // Caption-track mode: ask YouTube to open with this language's captions on.
  return `https://www.youtube.com/embed/${id}?rel=0&cc_load_policy=1&cc_lang_pref=${lang}&hl=${lang}`;
}

export default function SubtitledPlayer({ video, title, locale, onSwitch }: {
  video: SubtitledVideo;
  title: string;
  locale: Locale;
  onSwitch?: (lang: Locale) => void;
}) {
  // Follow the site's language until the viewer picks one themselves.
  const [picked, setPicked] = useState<Locale | null>(null);
  const lang = picked ?? locale;

  return (
    <div className={styles.subtitledPlayer}>
      <div className={styles.episodeFrame}>
        <iframe
          key={lang}
          src={embedSrc(video, lang)}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>
      <div className={styles.subtitleSwitch} role="group" aria-label={SUBTITLES_LABEL[locale]}>
        <span>{SUBTITLES_LABEL[locale]}</span>
        {LANGUAGES.map((item) => (
          <button
            key={item.id}
            type="button"
            lang={item.id}
            aria-pressed={lang === item.id}
            onClick={() => { setPicked(item.id); onSwitch?.(item.id); }}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}
