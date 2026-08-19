'use client';

import styles from './screening.module.css';

// Official Vimeo embed parameters only.
// Share / Like / Watch Later / screenshot are not URL parameters — they
// are set in the video's Vimeo Appearance > Embed settings (or a preset).
// Do not set vimeo_logo=0: that hides the logo slot Vimeo uses for a
// custom logo / on-player watermark.
const PLAYER_PARAMETERS = new URLSearchParams({
  autoplay: '0',
  autopause: '0',
  controls: '1',
  play_button_position: 'bottom',
  fullscreen: '0',
  keyboard: '0',
  title: '0',
  byline: '0',
  portrait: '0',
  badge: '0',
  pip: '0',
  chromecast: '0',
  chapters: '0',
  transcript: '0',
  watch_full_video: '0',
  speed: '1',
  cc: '1',
  quality_selector: '1',
  transparent: '0',
  color: 'c8a764',
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
        referrerPolicy="strict-origin-when-cross-origin"
      />

      {/* Transparent click shield over Vimeo's top-right social cluster
          (share / watch later / like / capture). No visual gradient, and
          the Vimeo / custom-logo corner at bottom-right stays open so the
          moving viewer watermark can land there. */}
      <div className={styles.nativeActionGuard} aria-hidden="true" />
    </>
  );
}
