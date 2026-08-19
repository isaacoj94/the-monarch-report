'use client';

import styles from './screening.module.css';

const PLAYER_PARAMETERS = new URLSearchParams({
  autoplay: '0',
  autopause: '0',
  controls: '1',
  fullscreen: '0',
  keyboard: '0',
  title: '0',
  byline: '0',
  portrait: '0',
  badge: '0',
  vimeo_logo: '0',
  pip: '0',
  chromecast: '0',
  chapters: '0',
  transcript: '0',
  watch_full_video: '0',
  like: '0',
  watchlater: '0',
  share: '0',
  screenshot: '0',
  speed: '1',
  cc: '1',
  quality_selector: '1',
  player_id: '0',
  app_id: '58479',
  dnt: '1',
}).toString();

export function SecureVimeoPlayer({ videoId, title }: { videoId: string; title: string }) {
  return (
    <>
      <iframe
        key={videoId}
        className={styles.vimeoFrame}
        src={`https://player.vimeo.com/video/${encodeURIComponent(videoId)}?${PLAYER_PARAMETERS}`}
        title={`${title} private screener`}
        allow="autoplay; encrypted-media"
      />

      {/* Feathered guards conceal and block Vimeo's social actions and
          outbound branding without covering the film with a hard rectangle. */}
      <div className={styles.nativeActionGuard} aria-hidden="true" />
      <div className={styles.nativeBrandGuard} aria-hidden="true" />
    </>
  );
}
