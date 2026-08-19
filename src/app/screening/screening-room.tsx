'use client';

import { useMemo, useState } from 'react';
import type { ScreeningEpisode, ViewerAccess } from '@/lib/screening';
import { useLocale } from '@/components/LocaleProvider';
import { SecureVimeoPlayer } from './secure-vimeo-player';
import { clearViewerSession, ViewerSessionGuard } from './viewer-session-guard';
import styles from './screening.module.css';

const roomCopy = {
  en: {
    screener: 'Private screener', end: 'End secure session', access: 'YOUR ACCESS', viewer: 'Viewer', devices: 'Devices', views: 'Views', expires: 'Expires',
    allowed: 'ALLOWED', started: 'STARTED', of: 'OF', used: 'USED', noExpiry: 'NO EXPIRY',
    noAccess: 'NO ACCESS', awaiting: 'AWAITING MASTER', available: 'AVAILABLE',
    watermark: 'A moving viewer watermark is applied to discourage unauthorized capture and redistribution.',
    identified: 'IDENTIFIED PLAYBACK', min: 'MIN',
  },
  ko: {
    screener: '비공개 시사회', end: '시사회 종료', access: '당신의 권한', viewer: '초대 번호', devices: '기기', views: '열람', expires: '만료',
    allowed: '대', started: '회 시작', of: '/', used: '회', noExpiry: '기한 없음',
    noAccess: '권한 없음', awaiting: '원본 대기', available: '시청 가능',
    watermark: '무단 촬영과 유출을 막기 위해, 초대 번호가 화면 위를 움직입니다.',
    identified: '식별 재생', min: '분',
  },
  ja: {
    screener: '非公開試写', end: '試写を終える', access: 'あなたの権限', viewer: '招待番号', devices: '端末', views: '閲覧', expires: '期限',
    allowed: '台', started: '回開始', of: '/', used: '回', noExpiry: '期限なし',
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
  const episode = access.episodes[episodeIndex];
  const isPlayable = Boolean(episode.grantId && episode.hasVideo && episode.vimeoVideoId);

  const viewsLabel = useMemo(() => {
    if (episode.viewLimit === null) return `${episode.viewsStarted} ${copy.started}`;
    return `${episode.viewsStarted} ${copy.of} ${episode.viewLimit} ${copy.used}`;
  }, [episode, copy]);

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
        <div className={`${styles.player} ${isPlayable ? styles.playing : ''}`}>
          {isPlayable ? (
            <SecureVimeoPlayer videoId={episode.vimeoVideoId!} title={episode.title} />
          ) : (
            <>
              <div className={styles.playerArt} aria-hidden="true" />
              <div className={styles.playerShade} aria-hidden="true" />
            </>
          )}
          <div className={styles.frameCode}>MR–YN–E{String(episode.episodeNumber).padStart(2, '0')} / SECURE MASTER</div>
          <div className={styles.watermark}>{access.viewerCode} · PRIVATE SCREENER</div>
          <div className={styles.playerTitle}>
            <span>EPISODE {String(episode.episodeNumber).padStart(2, '0')} / {episode.country}</span>
            <h2>{episode.title}</h2>
          </div>
          {!isPlayable && <div className={styles.demoNotice}>{episodeStatus(episode, copy)}</div>}
        </div>

        <aside className={styles.accessPanel}>
          <span>{copy.access}</span>
          <dl>
            <div><dt>{copy.viewer}</dt><dd>{access.viewerCode}</dd></div>
            <div><dt>{copy.devices}</dt><dd>{episode.deviceLimit} {copy.allowed}</dd></div>
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
            onClick={() => setEpisodeIndex(index)}
          >
            <span>{String(item.episodeNumber).padStart(2, '0')}</span>
            <div><small>{item.country} · {episodeStatus(item, copy)}</small><strong>{item.title}</strong></div>
            <b>{item.runtimeMinutes} {copy.min}</b>
          </button>
        ))}
      </div>
    </section>
  );
}
