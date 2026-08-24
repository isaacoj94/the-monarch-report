'use client';

import { useActionState, useState } from 'react';
import type { ScreeningEpisode, ViewerFeedbackEntry } from '@/lib/screening';
import { useLocale } from '@/components/LocaleProvider';
import { submitScreeningFeedbackAction, type FeedbackState } from './actions';
import styles from './screening.module.css';

const feedbackCopy = {
  en: {
    heading: 'PRODUCTION NOTES',
    privacy: 'Private — visible only to you and the filmmakers. Other viewers never see these.',
    hint: 'Click anywhere outside the film — or press Space — to pause while you write.',
    stamp: 'Stamp current time',
    clear: 'Clear',
    placeholder: 'Reactions, corrections, or a note about a specific moment…',
    send: 'Send note',
    sending: 'Sending…',
    saved: 'Note saved.',
    yourNotes: 'YOUR NOTES',
    none: 'No notes yet.',
    episode: 'EP',
  },
  ko: {
    heading: '제작 노트',
    privacy: '비공개 — 본인과 제작진에게만 보입니다. 다른 시청자는 볼 수 없습니다.',
    hint: '화면 밖을 클릭하거나 스페이스 키를 누르면 재생이 멈춥니다.',
    stamp: '현재 시점 기록',
    clear: '지우기',
    placeholder: '느낀 점, 수정 제안, 특정 장면에 대한 의견을 남겨 주십시오…',
    send: '메모 보내기',
    sending: '보내는 중…',
    saved: '메모가 저장되었습니다.',
    yourNotes: '내 메모',
    none: '아직 메모가 없습니다.',
    episode: 'EP',
  },
  ja: {
    heading: '制作ノート',
    privacy: '非公開 — 本人と制作陣のみ閲覧できる。他の視聴者には見えない。',
    hint: '画面の外をクリックするか、スペースキーで再生が止まる。',
    stamp: '現在時刻を記録',
    clear: '消去',
    placeholder: '感想、修正案、特定の場面への意見を記入…',
    send: 'メモを送る',
    sending: '送信中…',
    saved: 'メモを保存した。',
    yourNotes: 'あなたのメモ',
    none: 'まだメモはない。',
    episode: 'EP',
  },
} as const;

const feedbackInitial: FeedbackState = { error: null, savedAt: null };

function FeedbackForm({
  copy,
  episodeId,
  state,
  action,
  pending,
  getCurrentTime,
}: {
  copy: (typeof feedbackCopy)[keyof typeof feedbackCopy];
  episodeId: string;
  state: FeedbackState;
  action: (formData: FormData) => void;
  pending: boolean;
  getCurrentTime: () => Promise<number | null>;
}) {
  const [timecode, setTimecode] = useState<number | null>(null);

  const stampTime = async () => {
    const seconds = await getCurrentTime();
    if (seconds !== null) setTimecode(Math.floor(seconds));
  };

  return (
    <form action={action}>
      <input type="hidden" name="episodeId" value={episodeId} />
      <input type="hidden" name="timecodeSeconds" value={timecode ?? ''} />
      <div className={styles.feedbackStampRow}>
        <button type="button" onClick={() => void stampTime()}>◉ {copy.stamp}</button>
        {timecode !== null && (
          <span className={styles.stampValue}>
            {formatTimecode(timecode)}
            <button type="button" onClick={() => setTimecode(null)}>{copy.clear}</button>
          </span>
        )}
      </div>
      <textarea name="body" maxLength={2000} rows={4} required placeholder={copy.placeholder} />
      {state.error && <div className={styles.feedbackError} role="alert">{state.error}</div>}
      {!state.error && state.savedAt && <div className={styles.feedbackSaved} role="status">{copy.saved}</div>}
      <div className={styles.feedbackSendRow}>
        <small>{copy.hint}</small>
        <button type="submit" disabled={pending}>{pending ? copy.sending : copy.send}</button>
      </div>
    </form>
  );
}

export function formatTimecode(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);
  const core = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  return hours > 0 ? `${hours}:${core}` : core;
}

export function FeedbackPanel({
  episode,
  episodes,
  entries,
  getCurrentTime,
}: {
  episode: ScreeningEpisode;
  episodes: ScreeningEpisode[];
  entries: ViewerFeedbackEntry[];
  getCurrentTime: () => Promise<number | null>;
}) {
  const { locale } = useLocale();
  const copy = feedbackCopy[locale];
  const [state, action, pending] = useActionState(submitScreeningFeedbackAction, feedbackInitial);

  const episodeNumber = (episodeId: string) =>
    episodes.find((item) => item.id === episodeId)?.episodeNumber ?? null;

  return (
    <section className={styles.feedbackPanel} aria-label={copy.heading}>
      <div className={styles.feedbackForm}>
        <span className={styles.feedbackHeading}>{copy.heading} / E{String(episode.episodeNumber).padStart(2, '0')}</span>
        <p className={styles.feedbackPrivacy}><i /> {copy.privacy}</p>
        {/* Remounting on savedAt clears the note and its timecode after a save. */}
        <FeedbackForm
          key={state.savedAt ?? 'unsaved'}
          copy={copy}
          episodeId={episode.id}
          state={state}
          action={action}
          pending={pending}
          getCurrentTime={getCurrentTime}
        />
      </div>

      <div className={styles.feedbackList}>
        <span className={styles.feedbackHeading}>{copy.yourNotes}</span>
        {entries.length === 0 ? (
          <p className={styles.feedbackEmpty}>{copy.none}</p>
        ) : (
          <ul>
            {entries.map((entry) => {
              const number = episodeNumber(entry.episodeId);
              return (
                <li key={entry.id}>
                  <div className={styles.feedbackMeta}>
                    {number !== null && <b>{copy.episode} {String(number).padStart(2, '0')}</b>}
                    {entry.timecodeSeconds !== null && <b>◉ {formatTimecode(entry.timecodeSeconds)}</b>}
                    <time>{new Date(entry.createdAt).toISOString().slice(0, 10)}</time>
                  </div>
                  <p>{entry.body}</p>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
