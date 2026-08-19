import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export type ScreeningEpisode = {
  id: string;
  slug: string;
  episodeNumber: number;
  country: string;
  title: string;
  runtimeMinutes: number;
  status: 'available' | 'coming_soon' | 'unavailable';
  hasVideo: boolean;
  vimeoVideoId: string | null;
  grantId: string | null;
  expiresAt: string | null;
  viewLimit: number | null;
  viewsStarted: number;
  deviceLimit: number;
};

export type ViewerAccess = {
  viewerId: string;
  viewerCode: string;
  displayName: string | null;
  episodes: ScreeningEpisode[];
};

type EpisodeRow = {
  id: string;
  slug: string;
  episode_number: number;
  country: string;
  title: string;
  runtime_minutes: number;
  vimeo_video_id: string | null;
  status: ScreeningEpisode['status'];
};

type GrantRow = {
  id: string;
  episode_id: string;
  expires_at: string | null;
  view_limit: number | null;
  views_started: number;
  device_limit: number;
  status: 'active' | 'expired' | 'revoked';
};

export async function getAuthenticatedUser() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();
  return error ? null : data.user;
}

export async function isScreeningAdministrator(userId: string) {
  const admin = createSupabaseAdminClient();
  const { data } = await admin
    .from('screening_admins')
    .select('user_id')
    .eq('user_id', userId)
    .maybeSingle();

  return Boolean(data);
}

export async function getViewerAccess(): Promise<ViewerAccess | null> {
  const user = await getAuthenticatedUser();
  if (!user) return null;

  const admin = createSupabaseAdminClient();
  const { data: viewer } = await admin
    .from('screening_viewers')
    .select('id, viewer_code, display_name, status')
    .eq('auth_user_id', user.id)
    .maybeSingle();

  if (!viewer || viewer.status !== 'active') return null;

  const [{ data: episodeData }, { data: grantData }] = await Promise.all([
    admin.from('screening_episodes').select('*').order('episode_number'),
    admin
      .from('screening_access_grants')
      .select('id, episode_id, expires_at, view_limit, views_started, device_limit, status')
      .eq('viewer_id', viewer.id),
  ]);

  const episodes = (episodeData ?? []) as EpisodeRow[];
  const grants = (grantData ?? []) as GrantRow[];
  const now = Date.now();

  return {
    viewerId: viewer.id,
    viewerCode: viewer.viewer_code,
    displayName: viewer.display_name,
    episodes: episodes.map((episode) => {
      const grant = grants.find((item) => item.episode_id === episode.id);
      const active = Boolean(
        grant &&
          grant.status === 'active' &&
          (!grant.expires_at || new Date(grant.expires_at).getTime() > now),
      );

      return {
        id: episode.id,
        slug: episode.slug,
        episodeNumber: episode.episode_number,
        country: episode.country,
        title: episode.title,
        runtimeMinutes: episode.runtime_minutes,
        status: episode.status,
        hasVideo: active && Boolean(episode.vimeo_video_id),
        vimeoVideoId: active ? episode.vimeo_video_id : null,
        grantId: active && grant ? grant.id : null,
        expiresAt: active && grant ? grant.expires_at : null,
        viewLimit: active && grant ? grant.view_limit : null,
        viewsStarted: grant?.views_started ?? 0,
        deviceLimit: grant?.device_limit ?? 1,
      };
    }),
  };
}
