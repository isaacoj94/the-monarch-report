import Image from 'next/image';
import Link from 'next/link';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { getAuthenticatedUser, isScreeningAdministrator } from '@/lib/screening';
import { revokeViewerAction, signOutAction } from '../actions';
import { AdminLogin, InvitationForm } from './screening-admin-forms';
import styles from './screening-admin.module.css';

export const dynamic = 'force-dynamic';

type EpisodeOption = { id: string; episode_number: number; country: string; title: string };
type ViewerRow = {
  id: string;
  viewer_code: string;
  display_name: string | null;
  status: string;
  created_at: string;
  screening_access_grants: Array<{
    expires_at: string | null;
    views_started: number;
    view_limit: number | null;
    screening_episodes: { title: string } | null;
  }>;
};

function utcDate(value: string | null) {
  if (!value) return 'No expiry';
  return new Date(value).toISOString().replace('T', ' ').slice(0, 16) + ' UTC';
}

export default async function ScreeningAdminPage() {
  let user = null;
  let configured = true;
  try {
    user = await getAuthenticatedUser();
  } catch {
    configured = false;
  }

  const authorized = user ? await isScreeningAdministrator(user.id) : false;

  if (!authorized) {
    return <AdminLogin configured={configured} />;
  }

  const admin = createSupabaseAdminClient();
  const [{ data: episodeData }, { data: viewerData }] = await Promise.all([
    admin
      .from('screening_episodes')
      .select('id, episode_number, country, title')
      .order('episode_number'),
    admin
      .from('screening_viewers')
      .select('id, viewer_code, display_name, status, created_at, screening_access_grants(expires_at, views_started, view_limit, screening_episodes(title))')
      .order('created_at', { ascending: false })
      .limit(30),
  ]);
  const episodes = (episodeData ?? []) as EpisodeOption[];
  const viewers = (viewerData ?? []) as unknown as ViewerRow[];

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link href="/films" className={styles.brand}>
          <Image src="/logos/monarch-films-butterfly.png" alt="" width={36} height={36} />
          <span>MONARCH <b>FILMS</b></span>
        </Link>
        <span>SCREENING ADMINISTRATION</span>
        <form action={signOutAction}><button type="submit">Sign out</button></form>
      </header>

      <section className={styles.shell}>
        <div className={styles.intro}>
          <span>PRIVATE DISTRIBUTION DESK</span>
          <h1>Issue and control<br /><em>screening access.</em></h1>
          <p>Create one viewer at a time. Each invitation receives a unique ID, an unrecoverable one-time password, an expiry, and episode-specific limits.</p>
        </div>

        <InvitationForm episodes={episodes} />

        <section className={styles.ledger}>
          <div className={styles.ledgerHeading}>
            <div><span>ACCESS LEDGER</span><h2>Recent invitations</h2></div>
            <b>{viewers.length} RECORDS</b>
          </div>
          {viewers.length === 0 ? (
            <p className={styles.empty}>No viewer invitations have been issued yet.</p>
          ) : (
            <div className={styles.tableWrap}>
              <table>
                <thead><tr><th>Viewer</th><th>Episode</th><th>Usage</th><th>Expiry</th><th>Status</th><th /></tr></thead>
                <tbody>
                  {viewers.map((viewer) => {
                    const grant = viewer.screening_access_grants?.[0];
                    return (
                      <tr key={viewer.id}>
                        <td><strong>{viewer.viewer_code}</strong><small>{viewer.display_name || 'Unnamed viewer'}</small></td>
                        <td>{grant?.screening_episodes?.title || '—'}</td>
                        <td>{grant ? `${grant.views_started} / ${grant.view_limit ?? '∞'}` : '—'}</td>
                        <td>{utcDate(grant?.expires_at ?? null)}</td>
                        <td><span className={viewer.status === 'active' ? styles.active : styles.revoked}>{viewer.status}</span></td>
                        <td>
                          {viewer.status === 'active' && (
                            <form action={revokeViewerAction}>
                              <input type="hidden" name="viewerId" value={viewer.id} />
                              <button type="submit">Revoke</button>
                            </form>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </section>
    </main>
  );
}
