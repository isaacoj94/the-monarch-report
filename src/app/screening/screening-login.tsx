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
    ko: { invite: '초대 전용 프리미어 시사회', dek: '세 나라, 하나의 박해 구조. 증언과 공공 기록, 영화적 재구성으로 만든 다큐멘터리 시리즈를 먼저 만나보세요.', series: '3부작 다큐시리즈', countries: '중국 · 일본 · 한국', access: '시청자 인증', enter: '비공개 시사회 입장', notice: '접속 권한은 개인별로 발급됩니다. 콘텐츠 보호를 위해 접속 및 시청 기록이 저장될 수 있습니다.', viewer: '시청자 ID', key: '비공개 접속 키', verifying: '접속 확인 중…', button: '비공개 시사회 입장', warning: '개인 전용 계정입니다. 초대 정보는 전달하거나 공유하지 마세요.', config: '현재 환경에 시사회 접속 설정이 없습니다.' },
    ja: { invite: '招待者限定プレミア試写', dek: '三つの国、一つの迫害構造。証言、公的記録、映画的再構成で描くドキュメンタリーシリーズを先行公開します。', series: '全3話ドキュメンタリー', countries: '中国 · 日本 · 韓国', access: '視聴者認証', enter: '限定試写室へ', notice: 'アクセスは個別に発行されます。コンテンツ保護のため、接続および視聴履歴を記録する場合があります。', viewer: '視聴者ID', key: 'プライベートアクセスキー', verifying: '確認中…', button: '限定試写へ入る', warning: '個人専用の認証情報です。招待情報を転送・共有しないでください。', config: 'この環境では試写アクセスが設定されていません。' },
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
