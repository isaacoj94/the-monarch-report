'use client';

import styles from './screening.module.css';

// Mirror the Vimeo Appearance > Embed preset applied to the screening masters.
// Share / Like / Watch Later / Embed / custom logo are video-level only.
const PLAYER_PARAMETERS = new URLSearchParams({
  autoplay: '0',
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
}).toString();

export function SecureVimeoPlayer({ videoId, title }: { videoId: string; title: string }) {
  return (
    <iframe
      key={videoId}
      className={styles.vimeoFrame}
      src={`https://player.vimeo.com/video/${encodeURIComponent(videoId)}?${PLAYER_PARAMETERS}`}
      title={`${title} private screener`}
      allow="autoplay; encrypted-media"
      referrerPolicy="strict-origin-when-cross-origin"
    />
  );
}
