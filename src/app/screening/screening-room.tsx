'use client';

import { useMemo, useState } from 'react';
import type { ScreeningEpisode, ViewerAccess } from '@/lib/screening';
import { SecureVimeoPlayer } from './secure-vimeo-player';
import styles from './screening.module.css';

function expiryLabel(value: string | null) {
  if (!value) return 'NO EXPIRY';
  return new Intl.DateTimeFormat('en-US', {
    timeZone: 'UTC', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false,
  }).format(new Date(value)) + ' UTC';
}

function episodeStatus(episode: ScreeningEpisode) {
  if (!episode.grantId) return 'NO ACCESS';
  if (!episode.hasVideo) return 'AWAITING MASTER';
  return 'AVAILABLE';
}

export function ScreeningRoom({
  access,
  signOutAction,
}: {
  access: ViewerAccess;
  signOutAction: () => Promise<void>;
}) {
  const firstAccessible = Math.max(0, access.episodes.findIndex((episode) => episode.grantId));
  const [episodeIndex, setEpisodeIndex] = useState(firstAccessible);
  const episode = access.episodes[episodeIndex];
  const isPlayable = Boolean(episode.grantId && episode.hasVideo && episode.vimeoVideoId);

  const viewsLabel = useMemo(() => {
    if (episode.viewLimit === null) return `${episode.viewsStarted} STARTED`;
    return `${episode.viewsStarted} OF ${episode.viewLimit} USED`;
  }, [episode]);

  return (
    <section className={styles.screeningRoom}>
      <div className={styles.roomHeading}>
        <div>
          <span className={styles.eyebrow}>Private screener / {access.viewerCode}</span>
          <h1>You’re Next: <em>Do Nothing.</em></h1>
        </div>
        <form action={signOutAction}><button type="submit">End secure session</button></form>
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
          {!isPlayable && <div className={styles.demoNotice}>{episodeStatus(episode)}</div>}
        </div>

        <aside className={styles.accessPanel}>
          <span>YOUR ACCESS</span>
          <dl>
            <div><dt>Viewer</dt><dd>{access.viewerCode}</dd></div>
            <div><dt>Devices</dt><dd>{episode.deviceLimit} ALLOWED</dd></div>
            <div><dt>Views</dt><dd>{viewsLabel}</dd></div>
            <div><dt>Expires</dt><dd>{expiryLabel(episode.expiresAt)}</dd></div>
          </dl>
          <div className={styles.protection}><i /> IDENTIFIED PLAYBACK<p>A moving viewer watermark is applied to discourage unauthorized capture and redistribution.</p></div>
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
            <div><small>{item.country} · {episodeStatus(item)}</small><strong>{item.title}</strong></div>
            <b>{item.runtimeMinutes} MIN</b>
          </button>
        ))}
      </div>
    </section>
  );
}
