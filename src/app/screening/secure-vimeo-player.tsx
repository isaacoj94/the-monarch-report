'use client';

import Player from '@vimeo/player';
import { useEffect, useRef, useState } from 'react';
import styles from './screening.module.css';

type QualityOption = { id: string; label: string; active: boolean };
type TextTrackOption = { language: string; kind: string; label: string; mode: string };

const PLAYER_PARAMETERS = new URLSearchParams({
  autoplay: '0',
  controls: '0',
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
  speed: '1',
  cc: '1',
  quality_selector: '1',
  dnt: '1',
}).toString();

function clock(value: number) {
  if (!Number.isFinite(value)) return '0:00';
  const minutes = Math.floor(value / 60);
  const seconds = Math.floor(value % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
}

export function SecureVimeoPlayer({ videoId, title }: { videoId: string; title: string }) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const playerRef = useRef<Player | null>(null);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [quality, setQuality] = useState('auto');
  const [qualities, setQualities] = useState<QualityOption[]>([]);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [tracks, setTracks] = useState<TextTrackOption[]>([]);
  const [activeTrack, setActiveTrack] = useState('off');

  useEffect(() => {
    if (!iframeRef.current) return;
    const player = new Player(iframeRef.current);
    playerRef.current = player;
    let disposed = false;

    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onEnded = () => setPlaying(false);
    const onTime = ({ seconds, duration: total }: { seconds: number; duration: number }) => {
      setCurrentTime(seconds);
      setDuration(total);
    };

    player.on('play', onPlay);
    player.on('pause', onPause);
    player.on('ended', onEnded);
    player.on('timeupdate', onTime);

    void player.ready().then(async () => {
      const [total, availableQualities, currentQuality, textTracks, rate] = await Promise.all([
        player.getDuration(),
        player.getQualities().catch(() => [] as QualityOption[]),
        player.getQuality().catch(() => 'auto'),
        player.getTextTracks().catch(() => [] as TextTrackOption[]),
        player.getPlaybackRate().catch(() => 1),
      ]);
      if (disposed) return;
      setDuration(total);
      setQualities(availableQualities as QualityOption[]);
      setQuality(currentQuality);
      setTracks(textTracks as TextTrackOption[]);
      const selectedTrack = (textTracks as TextTrackOption[]).find((track) => track.mode === 'showing');
      setActiveTrack(selectedTrack ? `${selectedTrack.language}|${selectedTrack.kind}` : 'off');
      setPlaybackRate(rate);
      setReady(true);
    }).catch(() => setReady(true));

    return () => {
      disposed = true;
      player.off('play', onPlay);
      player.off('pause', onPause);
      player.off('ended', onEnded);
      player.off('timeupdate', onTime);
      playerRef.current = null;
    };
  }, [videoId]);

  async function togglePlayback() {
    const player = playerRef.current;
    if (!player) return;
    if (playing) await player.pause();
    else await player.play();
  }

  async function chooseTrack(value: string) {
    const player = playerRef.current;
    if (!player) return;
    if (value === 'off') await player.disableTextTrack();
    else {
      const [language, kind] = value.split('|');
      await player.enableTextTrack(language, kind);
    }
    setActiveTrack(value);
  }

  return (
    <>
      <iframe
        key={videoId}
        ref={iframeRef}
        className={styles.vimeoFrame}
        src={`https://player.vimeo.com/video/${encodeURIComponent(videoId)}?${PLAYER_PARAMETERS}`}
        title={`${title} private screener`}
        allow="autoplay; encrypted-media"
      />

      {!playing && (
        <button type="button" className={styles.secureCenterPlay} onClick={togglePlayback} disabled={!ready} aria-label="Play protected screening">
          {ready ? '▶' : '…'}
        </button>
      )}

      <div className={styles.securePlayerControls}>
        <button type="button" onClick={togglePlayback} disabled={!ready} aria-label={playing ? 'Pause' : 'Play'}>{playing ? 'Ⅱ' : '▶'}</button>
        <span>{clock(currentTime)}</span>
        <input
          aria-label="Playback position"
          type="range"
          min="0"
          max={Math.max(duration, 1)}
          step="0.25"
          value={Math.min(currentTime, Math.max(duration, 1))}
          onChange={(event) => {
            const nextTime = Number(event.target.value);
            setCurrentTime(nextTime);
            void playerRef.current?.setCurrentTime(nextTime);
          }}
        />
        <span>{clock(duration)}</span>

        {tracks.length > 0 && (
          <select aria-label="Closed captions" value={activeTrack} onChange={(event) => void chooseTrack(event.target.value)}>
            <option value="off">CC OFF</option>
            {tracks.map((track) => <option key={`${track.language}-${track.kind}`} value={`${track.language}|${track.kind}`}>{track.label || track.language}</option>)}
          </select>
        )}

        <select aria-label="Playback speed" value={playbackRate} onChange={(event) => {
          const rate = Number(event.target.value);
          setPlaybackRate(rate);
          void playerRef.current?.setPlaybackRate(rate);
        }}>
          {[0.75, 1, 1.25, 1.5, 2].map((rate) => <option key={rate} value={rate}>{rate}×</option>)}
        </select>

        {qualities.length > 0 && (
          <select aria-label="Video quality" value={quality} onChange={(event) => {
            setQuality(event.target.value);
            void playerRef.current?.setQuality(event.target.value);
          }}>
            {qualities.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
          </select>
        )}
      </div>
    </>
  );
}
