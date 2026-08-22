'use client';

import type { PointerEvent } from 'react';
import styles from './screening.module.css';

// Mirror the Vimeo Appearance > Embed preset. Share / Like / Watch Later /
// screenshot still render on this player even when those boxes are unchecked,
// so a transparent shield blocks that cluster without covering the film.
const PLAYER_PARAMETERS = {
  autopause: '0',
  controls: '1',
  play_button_position: 'bottom',
  progress_bar: '1',
  volume: '1',
  cc: '1',
  quality_selector: '1',
  speed: '1',
  skipping_forward: '1',
  audio_track: '0',
  chromecast: '0',
  airplay: '0',
  pip: '0',
  fullscreen: '0',
  vimeo_logo: '0',
  title: '0',
  byline: '0',
  portrait: '0',
  badge: '0',
  chapters: '0',
  transcript: '0',
  watch_full_video: '0',
  transparent: '0',
  dnt: '1',
} as const;

function absorb(event: PointerEvent<HTMLDivElement>) {
  event.preventDefault();
  event.stopPropagation();
}

export function SecureVimeoPlayer({ videoId, title, autoplay = false }: { videoId: string; title: string; autoplay?: boolean }) {
  const parameters = new URLSearchParams({
    ...PLAYER_PARAMETERS,
    autoplay: autoplay ? '1' : '0',
  }).toString();

  return (
    <>
      <iframe
        key={videoId}
        className={styles.vimeoFrame}
        src={`https://player.vimeo.com/video/${encodeURIComponent(videoId)}?${parameters}`}
        title={`${title} private screener`}
        allow="autoplay; encrypted-media"
        referrerPolicy="strict-origin-when-cross-origin"
      />
      <div
        className={styles.nativeActionGuard}
        aria-hidden="true"
        onPointerDown={absorb}
        onClick={absorb}
        onContextMenu={absorb}
      />
    </>
  );
}
