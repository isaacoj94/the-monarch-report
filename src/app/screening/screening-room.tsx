'use client';

import { useEffect, useMemo, useState } from 'react';
import type { ScreeningEpisode, ViewerAccess } from '@/lib/screening';
import { displayEpisodeTitle } from '@/lib/film-episodes';
import { useLocale } from '@/components/LocaleProvider';
import { SecureVimeoPlayer } from './secure-vimeo-player';
import { clearViewerSession, ViewerSessionGuard } from './viewer-session-guard';
import styles from './screening.module.css';

type PlaybackState = {
  episodeId: string;
  vimeoVideoId: string;
  watermark: string;
} | null;

const roomCopy = {
  en: {
    screener: 'Private screener', end: 'End secure session', access: 'YOUR ACCESS', viewer: 'Viewer', devices: 'Devices', views: 'Views', expires: 'Expires',
    allowed: 'ALLOWED', active: 'ACTIVE', started: 'STARTED', of: 'OF', used: 'USED', noExpiry: 'NO EXPIRY',
    noAccess: 'NO ACCESS', awaiting: 'AWAITING MASTER', available: 'AVAILABLE',
    watermark: 'A moving viewer watermark is applied to discourage unauthorized capture and redistribution.',
    identified: 'IDENTIFIED PLAYBACK', min: 'MIN',
  },
  ko: {
    screener: '비공개 시사회', end: '시사회 종료', access: '당신의 권한', viewer: '초대 번호', devices: '기기', views: '열람', expires: '만료',
    allowed: '대', active: '사용 중', started: '회 시작', of: '/', used: '회', noExpiry: '기한 없음',
    noAccess: '권한 없음', awaiting: '원본 대기', available: '시청 가능',
    watermark: '무단 촬영과 유출을 막기 위해, 초대 번호가 화면 위를 움직입니다.',
    identified: '식별 재생', min: '분',
  },
  ja: {
    screener: '非公開試写', end: '試写を終える', access: 'あなたの権限', viewer: '招待番号', devices: '端末', views: '閲覧', expires: '期限',
    allowed: '台', active: '使用中', started: '回開始', of: '/', used: '回', noExpiry: '期限なし',
    noAccess: '権限なし', awaiting: '原盤待ち', available: '視聴可',
    watermark: '無断撮影と流出を防ぐため、招待番号が画面上を動く。',
    identified: '識別再生', min: '分',
  },
} as const;

function expiryLabel(value: string | null, noExpiry: string) {
  if (!value) return noExpiry;
  return new Intl.DateTimeFormat('en-US', {
    timeZone: 'UTC', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false,
  }).format(new Date(value)) + ' UTC';
}

function episodeStatus(episode: ScreeningEpisode, copy: { noAccess: string; awaiting: string; available: string }) {
  if (!episode.grantId) return copy.noAccess;
  if (!episode.hasVideo) return copy.awaiting;
  return copy.available;
}

export function ScreeningRoom({
  access,
  signOutAction,
}: {
  access: ViewerAccess;
  signOutAction: () => Promise<void>;
}) {
  const { locale } = useLocale();
  const copy = roomCopy[locale];
  const firstAccessible = Math.max(0, access.episodes.findIndex((episode) => episode.grantId));
  const [episodeIndex, setEpisodeIndex] = useState(firstAccessible);
  const [playback, setPlayback] = useState<PlaybackState>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewCounts, setViewCounts] = useState<Record<string, number>>({});
  const [deviceCounts, setDeviceCounts] = useState<Record<string, number>>({});
  const episode = access.episodes[episodeIndex];
  const canStart = Boolean(episode.grantId && episode.hasVideo);
  const isPlaying = playback?.episodeId === episode.id;
  const viewsStarted = viewCounts[episode.id] ?? episode.viewsStarted;
  const devicesUsed = deviceCounts[episode.id] ?? episode.devicesUsed;

  const viewsLabel = useMemo(() => {
    if (episode.viewLimit === null) return `${viewsStarted} ${copy.started}`;
    return `${viewsStarted} ${copy.of} ${episode.viewLimit} ${copy.used}`;
  }, [episode.viewLimit, viewsStarted, copy]);

  useEffect(() => {
    if (!episode.expiresAt) return;

    const enforceExpiration = () => {
      if (new Date(episode.expiresAt!).getTime() <= Date.now()) {
        clearViewerSession();
        void signOutAction();
      }
    };

    enforceExpiration();
    const expirationTimer = window.setInterval(enforceExpiration, 15_000);
    return () => window.clearInterval(expirationTimer);
  }, [episode.expiresAt, signOutAction]);

  async function startPlayback() {
    if (!canStart || loading) return;
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/screening/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ episodeId: episode.id }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Playback could not begin.');

      setPlayback({ episodeId: episode.id, vimeoVideoId: data.vimeoVideoId, watermark: data.watermark });
      setViewCounts((current) => ({ ...current, [episode.id]: data.viewsStarted }));
      setDeviceCounts((current) => ({ ...current, [episode.id]: data.devicesUsed }));
    } catch (playbackError) {
      setError(playbackError instanceof Error ? playbackError.message : 'Playback could not begin.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className={styles.screeningRoom}>
      <ViewerSessionGuard endSession={signOutAction} />
      <div className={styles.roomHeading}>
        <div>
          <span className={styles.eyebrow}>{copy.screener} / {access.viewerCode}</span>
          <h1>You’re Next: <em>Do Nothing.</em></h1>
        </div>
        <form action={signOutAction} onSubmit={clearViewerSession}><button type="submit">{copy.end}</button></form>
      </div>

      <div className={styles.viewerLayout}>
        <div className={`${styles.player} ${isPlaying ? styles.playing : ''}`}>
          {isPlaying ? (
            <SecureVimeoPlayer videoId={playback.vimeoVideoId} title={episode.title} autoplay />
          ) : (
            <>
              <div className={styles.playerArt} aria-hidden="true" />
              <div className={styles.playerShade} aria-hidden="true" />
            </>
          )}
          <div className={styles.frameCode}>MR–YN–E{String(episode.episodeNumber).padStart(2, '0')} / SECURE MASTER</div>
          <div className={styles.watermark}>{playback?.watermark ?? `${access.viewerCode} · PRIVATE SCREENER`}</div>
          {!isPlaying && (
            <button
              className={styles.playControl}
              type="button"
              onClick={startPlayback}
              disabled={loading || !canStart}
              aria-label="Begin protected playback"
            >
              {loading ? '…' : canStart ? '▶' : '—'}
            </button>
          )}
          <div className={styles.playerTitle}>
            <span>EPISODE {String(episode.episodeNumber).padStart(2, '0')} / {episode.country}</span>
            <h2>{displayEpisodeTitle(episode.episodeNumber, episode.title)}</h2>
          </div>
          {!isPlaying && <div className={styles.demoNotice}>{episodeStatus(episode, copy)}</div>}
          {error && <div className={styles.playbackError} role="alert">{error}</div>}
        </div>

        <aside className={styles.accessPanel}>
          <span>{copy.access}</span>
          <dl>
            <div><dt>{copy.viewer}</dt><dd>{access.viewerCode}</dd></div>
            <div><dt>{copy.devices}</dt><dd>{devicesUsed} {copy.of} {episode.deviceLimit} {copy.active}</dd></div>
            <div><dt>{copy.views}</dt><dd>{viewsLabel}</dd></div>
            <div><dt>{copy.expires}</dt><dd>{expiryLabel(episode.expiresAt, copy.noExpiry)}</dd></div>
          </dl>
          <div className={styles.protection}><i /> {copy.identified}<p>{copy.watermark}</p></div>
        </aside>
      </div>

      <div className={styles.episodeRail}>
        {access.episodes.map((item, index) => (
          <button
            type="button"
            key={item.id}
            className={episodeIndex === index ? styles.activeEpisode : ''}
            onClick={() => { setEpisodeIndex(index); setPlayback(null); setError(null); }}
          >
            <span>{String(item.episodeNumber).padStart(2, '0')}</span>
            <div><small>{item.country} · {episodeStatus(item, copy)}</small><strong>{displayEpisodeTitle(item.episodeNumber, item.title)}</strong></div>
            <b>{item.runtimeMinutes} {copy.min}</b>
          </button>
        ))}
      </div>
    </section>
  );
}
