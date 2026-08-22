import Image from 'next/image';
import Link from 'next/link';
import { displayEpisodeTitle } from '@/lib/film-episodes';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { getAuthenticatedUser, isScreeningAdministrator } from '@/lib/screening';
import { revokeViewerAction, signOutAction } from '../actions';
import { AccessKeyCell, AdminLogin, CopyField, InvitationForm } from './screening-admin-forms';
import styles from './screening-admin.module.css';

export const dynamic = 'force-dynamic';

type EpisodeOption = { id: string; episode_number: number; country: string; title: string };
type ViewerRow = {
  id: string;
  auth_user_id: string;
  viewer_code: string;
  display_name: string | null;
  contact_email?: string | null;
  context_note?: string | null;
  access_key?: string | null;
  status: string;
  created_at: string;
  screening_access_grants: Array<{
    expires_at: string | null;
    views_started: number;
    view_limit: number | null;
    screening_episodes: { title: string; episode_number: number } | null;
  }>;
};

function metadataString(value: unknown) {
  return typeof value === 'string' && value.trim() ? value : null;
}

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
  const viewerSelect = 'id, auth_user_id, viewer_code, display_name, contact_email, context_note, access_key, status, created_at, screening_access_grants(expires_at, views_started, view_limit, screening_episodes(title, episode_number))';
  const fallbackSelect = 'id, auth_user_id, viewer_code, display_name, status, created_at, screening_access_grants(expires_at, views_started, view_limit, screening_episodes(title, episode_number))';
  const [{ data: episodeData }, viewerQuery] = await Promise.all([
    admin
      .from('screening_episodes')
      .select('id, episode_number, country, title')
      .order('episode_number'),
    admin
      .from('screening_viewers')
      .select(viewerSelect)
      .order('created_at', { ascending: false })
      .limit(30),
  ]);
  const { data: viewerData } = viewerQuery.error
    ? await admin
        .from('screening_viewers')
        .select(fallbackSelect)
        .order('created_at', { ascending: false })
        .limit(30)
    : viewerQuery;
  const episodes = (episodeData ?? []) as EpisodeOption[];
  const viewers = await Promise.all(((viewerData ?? []) as unknown as ViewerRow[]).map(async (viewer) => {
    const { data } = await admin.auth.admin.getUserById(viewer.auth_user_id);
    const metadata = data.user?.user_metadata ?? {};
    return {
      ...viewer,
      contact_email: metadataString(metadata.contact_email) ?? viewer.contact_email ?? null,
      context_note: metadataString(metadata.context_note) ?? viewer.context_note ?? null,
      access_key: metadataString(metadata.access_key) ?? viewer.access_key ?? null,
    };
  }));

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
          <p>Create one viewer at a time. Each invitation receives a unique ID, a private access key kept on this desk, context about who the viewer is, an expiry, and episode-specific limits.</p>
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
                <thead><tr><th>Viewer</th><th>Context</th><th>Access key</th><th>Episode</th><th>Usage</th><th>Expiry</th><th>Status</th><th /></tr></thead>
                <tbody>
                  {viewers.map((viewer) => {
                    const grant = viewer.screening_access_grants?.[0];
                    return (
                      <tr key={viewer.id}>
                        <td>
                          <CopyField value={viewer.viewer_code} label="Copy ID" />
                          <small>{viewer.display_name || 'Unnamed viewer'}</small>
                          {viewer.contact_email ? <small>{viewer.contact_email}</small> : null}
                        </td>
                        <td>{viewer.context_note ? <span className={styles.context}>{viewer.context_note}</span> : '—'}</td>
                        <td><AccessKeyCell accessKey={viewer.access_key ?? null} viewerId={viewer.id} active={viewer.status === 'active'} /></td>
                        <td>{grant?.screening_episodes ? displayEpisodeTitle(grant.screening_episodes.episode_number, grant.screening_episodes.title) : '—'}</td>
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
