'use client';

import { useCallback, useEffect, useRef } from 'react';
import type { PointerEvent } from 'react';
import Player from '@vimeo/player';
import styles from './screening.module.css';

export type PlayerApi = {
  getCurrentTime: () => Promise<number | null>;
};

// Mirror the Vimeo Appearance > Embed preset. Share / Like / Watch Later /
// screenshot still render on this player even when those boxes are unchecked,
// so a transparent shield blocks that cluster without covering the film.
const PLAYER_PARAMETERS = {
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
} as const;

function absorb(event: PointerEvent<HTMLDivElement>) {
  event.preventDefault();
  event.stopPropagation();
}

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  return (
    target.tagName === 'INPUT' ||
    target.tagName === 'TEXTAREA' ||
    target.tagName === 'SELECT' ||
    target.tagName === 'BUTTON' ||
    target.isContentEditable
  );
}

export function SecureVimeoPlayer({
  videoId,
  title,
  onPlayerReady,
}: {
  videoId: string;
  title: string;
  onPlayerReady?: (api: PlayerApi) => void;
}) {
  const parameters = new URLSearchParams(PLAYER_PARAMETERS).toString();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const playerRef = useRef<Player | null>(null);
  const playingRef = useRef(false);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const player = new Player(iframe);
    playerRef.current = player;
    playingRef.current = false;
    const onPlay = () => {
      playingRef.current = true;
    };
    const onHalt = () => {
      playingRef.current = false;
    };
    player.on('play', onPlay);
    player.on('pause', onHalt);
    player.on('ended', onHalt);
    onPlayerReady?.({
      getCurrentTime: () => player.getCurrentTime().catch(() => null),
    });

    return () => {
      playerRef.current = null;
      playingRef.current = false;
      player.off('play', onPlay);
      player.off('pause', onHalt);
      player.off('ended', onHalt);
    };
  }, [videoId, onPlayerReady]);

  const togglePlayback = useCallback(() => {
    const player = playerRef.current;
    if (!player) return;
    player
      .getPaused()
      .then((paused) => (paused ? player.play() : player.pause()))
      .catch(() => {});
  }, []);

  // Clicking the film itself already toggles playback inside the Vimeo frame.
  // These listeners extend that to the rest of the screen: any click outside
  // the frame, or the space bar, halts the film so the viewer can take notes.
  useEffect(() => {
    const pauseFromOutside = () => {
      const player = playerRef.current;
      if (!player || !playingRef.current) return;
      player.pause().catch(() => {});
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.code !== 'Space' || isTypingTarget(event.target)) return;
      event.preventDefault();
      togglePlayback();
    };
    document.addEventListener('click', pauseFromOutside);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('click', pauseFromOutside);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [togglePlayback]);

  return (
    <>
      <iframe
        ref={iframeRef}
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
