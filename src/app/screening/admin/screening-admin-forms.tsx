'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useActionState, useState } from 'react';
import { displayEpisodeTitle } from '@/lib/film-episodes';
import { adminLoginAction, createInvitationAction, rotateAccessKeyAction, type InvitationState, type LoginState } from '../actions';
import styles from './screening-admin.module.css';

const loginInitial: LoginState = { error: null };
const invitationInitial: InvitationState = { error: null, credentials: null };

export function AdminLogin({ configured }: { configured: boolean }) {
  const [state, action, pending] = useActionState(adminLoginAction, loginInitial);
  return (
    <main className={styles.loginPage}>
      <Link href="/films" className={styles.loginBrand}>
        <Image src="/logos/monarch-films-butterfly.png" alt="" width={42} height={42} />
        <span>MONARCH <b>FILMS</b></span>
      </Link>
      <form className={styles.loginCard} action={action}>
        <span>AUTHORIZED PERSONNEL</span>
        <h1>Screening administration</h1>
        <p>Sign in with the administrator account created in Supabase.</p>
        <label htmlFor="admin-email">Email</label>
        <input id="admin-email" name="email" type="email" autoComplete="username" required />
        <label htmlFor="admin-password">Password</label>
        <input id="admin-password" name="password" type="password" autoComplete="current-password" required />
        {(!configured || state.error) && <div className={styles.error} role="alert">{configured ? state.error : 'Supabase is not configured in this environment.'}</div>}
        <button type="submit" disabled={pending || !configured}>{pending ? 'Signing in…' : 'Enter administration'}</button>
        <Link href="/screening">Return to viewer access</Link>
      </form>
    </main>
  );
}

export function InvitationForm({ episodes }: { episodes: Array<{ id: string; episode_number: number; country: string; title: string }> }) {
  const [state, action, pending] = useActionState(createInvitationAction, invitationInitial);

  return (
    <section className={styles.issueCard}>
      <div className={styles.issueHeading}><span>NEW INVITATION</span><b>GENERATED SECURELY</b></div>
      <form action={action}>
        <label>Viewer name <small>Optional, for your records</small><input name="displayName" maxLength={100} placeholder="Jane Smith / Publication" /></label>
        <label>Viewer email <small>Optional, recorded only — not used to sign in</small><input name="contactEmail" type="email" autoComplete="off" placeholder="name@publication.com" /></label>
        <label>Context <small>Who this person is — journalist, donor, pastor, family, press, etc.</small><textarea name="contextNote" maxLength={280} rows={3} placeholder="e.g. Korean church leader, introduced by Will / US journalist, first look" /></label>
        <label>Episode<select name="episodeId" required defaultValue={episodes[0]?.id}>{episodes.map((episode) => <option value={episode.id} key={episode.id}>E{episode.episode_number} · {episode.country} — {displayEpisodeTitle(episode.episode_number, episode.title)}</option>)}</select></label>
        <div className={styles.formGrid}>
          <label>Access period<select name="expiresHours" defaultValue="48"><option value="24">24 hours</option><option value="48">48 hours</option><option value="72">72 hours</option><option value="168">7 days</option></select></label>
          <label>View limit<input name="viewLimit" type="number" min="1" max="20" defaultValue="3" /></label>
          <label>Device limit<select name="deviceLimit" defaultValue="1"><option value="1">1 device</option><option value="2">2 devices</option><option value="3">3 devices</option></select></label>
        </div>
        {state.error && <div className={styles.error} role="alert">{state.error}</div>}
        <button type="submit" disabled={pending || episodes.length === 0}>{pending ? 'Creating secure invitation…' : 'Create viewer invitation'}</button>
      </form>
      {state.credentials && (
        <div className={styles.credentials} role="status">
          <span>CREDENTIALS SAVED TO THIS DESK</span>
          <div><small>Viewer ID</small><strong>{state.credentials.viewerCode}</strong></div>
          <div>
            <small>Private access key</small>
            <span className={styles.keyValue}>
              <strong>{state.credentials.password}</strong>
              <CopyButton value={state.credentials.password} />
            </span>
          </div>
          {state.credentials.contactEmail && (
            <div><small>Recorded email</small><strong>{state.credentials.contactEmail}</strong></div>
          )}
          {state.credentials.contextNote && (
            <div><small>Context</small><strong>{state.credentials.contextNote}</strong></div>
          )}
          <p>This access key is stored on the administration desk so you can retrieve it later. Send the ID and key through separate channels when possible.</p>
        </div>
      )}
    </section>
  );
}

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      className={styles.copyButton}
      onClick={async () => {
        await navigator.clipboard.writeText(value);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1600);
      }}
    >
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
}

export function AccessKeyCell({ accessKey, viewerId, active }: { accessKey: string | null; viewerId: string; active: boolean }) {
  if (!accessKey) {
    if (!active) return <small>Not saved at issue</small>;
    return (
      <form action={rotateAccessKeyAction} className={styles.keyCell}>
        <small>Not saved at issue</small>
        <input type="hidden" name="viewerId" value={viewerId} />
        <button type="submit">Issue new key</button>
      </form>
    );
  }

  return (
    <div className={styles.keyCell}>
      <code>{accessKey}</code>
      <CopyButton value={accessKey} />
    </div>
  );
}
