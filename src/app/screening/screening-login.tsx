'use client';

import { useActionState } from 'react';
import { viewerLoginAction, type LoginState } from './actions';
import styles from './screening.module.css';

const initialState: LoginState = { error: null };

export function ScreeningLogin({ configurationError }: { configurationError: boolean }) {
  const [state, action, pending] = useActionState(viewerLoginAction, initialState);

  return (
    <section className={styles.accessShell}>
      <div className={styles.backdrop} aria-hidden="true" />
      <div className={styles.grade} aria-hidden="true" />
      <div className={styles.accessStory}>
        <span className={styles.eyebrow}>Invitation-only premiere access</span>
        <p className={styles.filmNumber}>MONARCH ORIGINAL / 001</p>
        <h1>You’re Next:<br /><em>Do Nothing.</em></h1>
        <p>Three nations. One blueprint of persecution. A private first look at the documentary series built from testimony, public records, and cinematic reconstruction.</p>
        <div className={styles.seriesLine}><span>3-PART DOCUSERIES</span><span>CHINA · JAPAN · KOREA</span><span>4K MASTER</span></div>
      </div>

      <form className={styles.accessCard} action={action}>
        <div className={styles.cardTop}><span>VIEWER ACCESS</span><span>01 / 01</span></div>
        <h2>Enter the screening room.</h2>
        <p>Access is issued individually. Your session and viewing activity may be recorded for content protection.</p>
        <label htmlFor="viewer-code">Viewer ID</label>
        <input id="viewer-code" name="viewerCode" placeholder="MR-8K4P2X7Q" autoComplete="username" required />
        <label htmlFor="access-key">Private access key</label>
        <input id="access-key" name="password" type="password" placeholder="••••••••••••" autoComplete="current-password" minLength={8} required />
        {(state.error || configurationError) && (
          <p className={styles.formError} role="alert">
            {configurationError ? 'Screening access is not configured in this environment.' : state.error}
          </p>
        )}
        <button type="submit" disabled={pending || configurationError}>
          {pending ? 'Verifying access…' : 'Enter private screening'} <span>→</span>
        </button>
        <small>Individual credentials only. Do not forward or share this invitation.</small>
      </form>
    </section>
  );
}
