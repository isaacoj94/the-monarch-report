'use client';

import { useActionState } from 'react';
import { viewerLoginAction, type LoginState } from './actions';
import { markViewerSession } from './viewer-session-guard';
import styles from './screening.module.css';
import { useLocale } from '@/components/LocaleProvider';

const initialState: LoginState = { error: null };

export function ScreeningLogin({ configurationError }: { configurationError: boolean }) {
  const { locale } = useLocale();
  const copy = {
    en: { invite: 'Invitation-only premiere access', dek: 'Three nations. One blueprint of persecution. A private first look at the documentary series built from testimony, public records, and cinematic reconstruction.', series: '3-PART DOCUSERIES', countries: 'CHINA · JAPAN · KOREA', access: 'VIEWER ACCESS', enter: 'Enter the screening room.', notice: 'Access is issued individually. Your session and viewing activity may be recorded for content protection.', viewer: 'Viewer ID', key: 'Private access key', verifying: 'Verifying access…', button: 'Enter private screening', warning: 'Individual credentials only. Do not forward or share this invitation.', config: 'Screening access is not configured in this environment.' },
    ko: { invite: '초대받은 이들만의 시사회', dek: '세 나라, 하나의 수법. 증언과 기록으로 추적한 다큐멘터리를, 먼저 본다.', series: '3부작', countries: '중국 · 일본 · 한국', access: '입장', enter: '시사회에 입장합니다', notice: '초대는 개인별로 발급됩니다. 작품 보호를 위해 접속 기록이 남을 수 있습니다.', viewer: '초대 번호', key: '입장 암호', verifying: '확인 중…', button: '시사회 입장', warning: '본인만 사용하십시오. 초대장을 넘기지 마십시오.', config: '이 환경에는 시사회 접속이 열려 있지 않습니다.' },
    ja: { invite: '招待者だけの試写', dek: '三つの国、ひとつの手法。証言と記録で追ったドキュメンタリーを、先に見る。', series: '全3話', countries: '中国 · 日本 · 韓国', access: '入場', enter: '試写室へ', notice: '招待は個別に発行されます。作品保護のため、接続記録を残すことがあります。', viewer: '招待番号', key: '入場暗証', verifying: '確認中…', button: '試写に入る', warning: 'ご本人のみご使用ください。招待状を渡さないでください。', config: 'この環境では試写に入れません。' },
  }[locale];
  const [state, action, pending] = useActionState(viewerLoginAction, initialState);

  return (
    <section className={styles.accessShell}>
      <div className={styles.backdrop} aria-hidden="true" />
      <div className={styles.grade} aria-hidden="true" />
      <div className={styles.accessStory}>
        <span className={styles.eyebrow}>{copy.invite}</span>
        <p className={styles.filmNumber}>MONARCH ORIGINAL / 001</p>
        <h1>You’re Next:<br /><em>Do Nothing.</em></h1>
        <p>{copy.dek}</p>
        <div className={styles.seriesLine}><span>{copy.series}</span><span>{copy.countries}</span><span>4K MASTER</span></div>
      </div>

      <form className={styles.accessCard} action={action} onSubmit={markViewerSession}>
        <div className={styles.cardTop}><span>{copy.access}</span><span>01 / 01</span></div>
        <h2>{copy.enter}</h2>
        <p>{copy.notice}</p>
        <label htmlFor="viewer-code">{copy.viewer}</label>
        <input id="viewer-code" name="viewerCode" placeholder="MR-8K4P2X7Q" autoComplete="username" required />
        <label htmlFor="access-key">{copy.key}</label>
        <input id="access-key" name="password" type="password" placeholder="••••••••••••" autoComplete="current-password" minLength={8} required />
        {(state.error || configurationError) && (
          <p className={styles.formError} role="alert">
            {configurationError ? copy.config : state.error}
          </p>
        )}
        <button type="submit" disabled={pending || configurationError}>
          {pending ? copy.verifying : copy.button} <span>→</span>
        </button>
        <small>{copy.warning}</small>
      </form>
    </section>
  );
}
