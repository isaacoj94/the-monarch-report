import { createHash, randomUUID } from 'node:crypto';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { ACTIVE_SCREENING_WINDOW_MS, getAuthenticatedUser, VIEWER_BROWSER_SESSION_COOKIE } from '@/lib/screening';

export const dynamic = 'force-dynamic';

const DEVICE_COOKIE = 'mr_screening_device';
const TRUSTED_SCREENING_ORIGINS = new Set([
  'https://monarchreport.org',
  'https://www.monarchreport.org',
]);

function json(body: Record<string, unknown>, status: number) {
  const response = NextResponse.json(body, { status });
  response.headers.set('Cache-Control', 'private, no-store');
  return response;
}

function hasTrustedOrigin(request: NextRequest) {
  const origin = request.headers.get('origin');
  if (!origin) return true;

  try {
    const normalizedOrigin = new URL(origin).origin;
    return normalizedOrigin === request.nextUrl.origin || TRUSTED_SCREENING_ORIGINS.has(normalizedOrigin);
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  if (!hasTrustedOrigin(request)) return json({ error: 'Invalid request origin.' }, 403);

  const cookieStore = await cookies();
  if (!cookieStore.get(VIEWER_BROWSER_SESSION_COOKIE)?.value) {
    return json({ error: 'Your screening session has ended. Sign in again.' }, 401);
  }

  const user = await getAuthenticatedUser();
  if (!user) return json({ error: 'Your screening session has expired. Sign in again.' }, 401);

  let episodeId = '';
  try {
    episodeId = String((await request.json()).episodeId ?? '');
  } catch {
    return json({ error: 'Invalid playback request.' }, 400);
  }
  if (!episodeId) return json({ error: 'No episode was selected.' }, 400);

  const admin = createSupabaseAdminClient();
  const { data: viewer } = await admin
    .from('screening_viewers')
    .select('id, viewer_code, status')
    .eq('auth_user_id', user.id)
    .maybeSingle();
  if (!viewer || viewer.status !== 'active') return json({ error: 'This invitation is no longer active.' }, 403);

  const [{ data: grant }, { data: episode }] = await Promise.all([
    admin
      .from('screening_access_grants')
      .select('id, expires_at, view_limit, views_started, device_limit, status')
      .eq('viewer_id', viewer.id)
      .eq('episode_id', episodeId)
      .maybeSingle(),
    admin
      .from('screening_episodes')
      .select('id, vimeo_video_id')
      .eq('id', episodeId)
      .maybeSingle(),
  ]);

  if (!grant || grant.status !== 'active') return json({ error: 'You do not have access to this episode.' }, 403);
  if (grant.expires_at && new Date(grant.expires_at).getTime() <= Date.now()) {
    await admin.from('screening_access_grants').update({ status: 'expired' }).eq('id', grant.id);
    return json({ error: 'This screening invitation has expired.' }, 403);
  }
  if (!episode?.vimeo_video_id) return json({ error: 'The protected video master has not been uploaded yet.' }, 409);

  const existingDeviceId = cookieStore.get(DEVICE_COOKIE)?.value;
  const deviceId = existingDeviceId || randomUUID();
  const deviceHash = createHash('sha256').update(deviceId).digest('hex');
  const activeSince = new Date(Date.now() - ACTIVE_SCREENING_WINDOW_MS).toISOString();

  const { data: activeSessions, error: activeSessionsError } = await admin
    .from('screening_sessions')
    .select('id, device_hash')
    .eq('grant_id', grant.id)
    .is('ended_at', null)
    .gte('last_active_at', activeSince)
    .order('last_active_at', { ascending: false });

  if (activeSessionsError) {
    return json({ error: 'Could not verify the active device count.' }, 500);
  }

  const existingSession = (activeSessions ?? []).find((session) => session.device_hash === deviceHash);
  const activeDevices = new Set((activeSessions ?? []).map((session) => session.device_hash));
  let viewsStarted = grant.views_started;

  if (existingSession) {
    await admin.from('screening_sessions').update({ last_active_at: new Date().toISOString() }).eq('id', existingSession.id);
  } else {
    if (!activeDevices.has(deviceHash) && activeDevices.size >= grant.device_limit) {
      return json({ error: 'The device limit for this invitation has been reached.' }, 403);
    }
    if (grant.view_limit !== null && grant.views_started >= grant.view_limit) {
      return json({ error: 'The viewing limit for this invitation has been reached.' }, 403);
    }

    const nextViews = grant.views_started + 1;
    const { data: updatedGrant } = await admin
      .from('screening_access_grants')
      .update({ views_started: nextViews })
      .eq('id', grant.id)
      .eq('views_started', grant.views_started)
      .select('id')
      .maybeSingle();
    if (!updatedGrant) return json({ error: 'Playback authorization changed. Please try again.' }, 409);
    viewsStarted = nextViews;

    const { error: sessionError } = await admin.from('screening_sessions').insert({
      grant_id: grant.id,
      viewer_id: viewer.id,
      device_hash: deviceHash,
    });
    if (sessionError) {
      await admin.from('screening_access_grants').update({ views_started: grant.views_started }).eq('id', grant.id).eq('views_started', nextViews);
      return json({ error: 'Could not establish the protected playback session.' }, 500);
    }

    activeDevices.add(deviceHash);
  }

  const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 16) + ' UTC';
  const response = json({
    vimeoVideoId: episode.vimeo_video_id,
    watermark: `${viewer.viewer_code} · PRIVATE SCREENER · ${timestamp}`,
    viewsStarted,
    viewLimit: grant.view_limit,
    devicesUsed: activeDevices.size,
    deviceLimit: grant.device_limit,
    expiresAt: grant.expires_at,
  }, 200);
  if (!existingDeviceId) {
    response.cookies.set(DEVICE_COOKIE, deviceId, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
    });
  }
  return response;
}
