'use server';

import { randomInt } from 'node:crypto';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { getAuthenticatedUser, isScreeningAdministrator, VIEWER_BROWSER_SESSION_COOKIE } from '@/lib/screening';

export type LoginState = { error: string | null };
export type InvitationState = {
  error: string | null;
  credentials: {
    viewerCode: string;
    password: string;
    contactEmail: string | null;
    contextNote: string | null;
  } | null;
};

const INVALID_CREDENTIALS = 'The viewer ID or access key is incorrect.';
const VIEWER_CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const PASSWORD_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%';

function randomString(alphabet: string, length: number) {
  return Array.from({ length }, () => alphabet[randomInt(0, alphabet.length)]).join('');
}

async function requireAdministrator() {
  const user = await getAuthenticatedUser();
  if (!user || !(await isScreeningAdministrator(user.id))) {
    throw new Error('Administrator access is required.');
  }
  return user;
}

export async function viewerLoginAction(_state: LoginState, formData: FormData): Promise<LoginState> {
  const viewerCode = String(formData.get('viewerCode') ?? '').trim().toUpperCase();
  const password = String(formData.get('password') ?? '');

  if (!/^MR-[A-Z0-9]{6,12}$/.test(viewerCode) || password.length < 8) {
    return { error: INVALID_CREDENTIALS };
  }

  try {
    const admin = createSupabaseAdminClient();
    const { data: viewer } = await admin
      .from('screening_viewers')
      .select('auth_user_id, status')
      .eq('viewer_code', viewerCode)
      .maybeSingle();

    if (!viewer || viewer.status !== 'active') return { error: INVALID_CREDENTIALS };

    const { data: authData } = await admin.auth.admin.getUserById(viewer.auth_user_id);
    if (!authData.user?.email) return { error: INVALID_CREDENTIALS };

    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: authData.user.email,
      password,
    });

    if (error) return { error: INVALID_CREDENTIALS };

    const cookieStore = await cookies();
    cookieStore.set(VIEWER_BROWSER_SESSION_COOKIE, 'active', {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
    });
  } catch {
    return { error: 'The screening service is temporarily unavailable. Please try again.' };
  }

  redirect('/screening');
}

export async function adminLoginAction(_state: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get('email') ?? '').trim().toLowerCase();
  const password = String(formData.get('password') ?? '');

  if (!email || !password) return { error: 'Enter your administrator email and password.' };

  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data.user || !(await isScreeningAdministrator(data.user.id))) {
      await supabase.auth.signOut();
      return { error: 'This account does not have screening administrator access.' };
    }
  } catch {
    return { error: 'Administrator sign-in is temporarily unavailable.' };
  }

  redirect('/screening/admin');
}

export async function signOutAction() {
  try {
    const user = await getAuthenticatedUser();
    if (user) {
      const admin = createSupabaseAdminClient();
      const { data: viewer } = await admin
        .from('screening_viewers')
        .select('id')
        .eq('auth_user_id', user.id)
        .maybeSingle();

      if (viewer) {
        await admin
          .from('screening_sessions')
          .update({ ended_at: new Date().toISOString() })
          .eq('viewer_id', viewer.id)
          .is('ended_at', null);
      }
    }
  } catch {
    // Authentication cookies must still be cleared if session cleanup fails.
  }

  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  const cookieStore = await cookies();
  cookieStore.delete(VIEWER_BROWSER_SESSION_COOKIE);
  redirect('/screening');
}

export async function createInvitationAction(
  _state: InvitationState,
  formData: FormData,
): Promise<InvitationState> {
  try {
    await requireAdministrator();
  } catch {
    return { error: 'Your administrator session has expired.', credentials: null };
  }

  const displayName = String(formData.get('displayName') ?? '').trim().slice(0, 100) || null;
  const contactEmailRaw = String(formData.get('contactEmail') ?? '').trim().toLowerCase();
  const contactEmail = contactEmailRaw || null;
  const contextNote = String(formData.get('contextNote') ?? '').trim().slice(0, 280) || null;
  if (contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail)) {
    return { error: 'Enter a valid email address, or leave it blank.', credentials: null };
  }
  const episodeId = String(formData.get('episodeId') ?? '');
  const expiresHours = Number(formData.get('expiresHours'));
  const viewLimit = Number(formData.get('viewLimit'));
  const deviceLimit = Number(formData.get('deviceLimit'));

  if (!episodeId || ![24, 48, 72, 168].includes(expiresHours)) {
    return { error: 'Choose a valid episode and access period.', credentials: null };
  }
  if (!Number.isInteger(viewLimit) || viewLimit < 1 || viewLimit > 20) {
    return { error: 'View limit must be between 1 and 20.', credentials: null };
  }
  if (!Number.isInteger(deviceLimit) || deviceLimit < 1 || deviceLimit > 3) {
    return { error: 'Device limit must be between 1 and 3.', credentials: null };
  }

  const admin = createSupabaseAdminClient();
  const { data: episode } = await admin
    .from('screening_episodes')
    .select('id')
    .eq('id', episodeId)
    .maybeSingle();
  if (!episode) return { error: 'The selected episode is unavailable.', credentials: null };

  let viewerCode = '';
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const candidate = `MR-${randomString(VIEWER_CODE_ALPHABET, 8)}`;
    const { data } = await admin
      .from('screening_viewers')
      .select('id')
      .eq('viewer_code', candidate)
      .maybeSingle();
    if (!data) {
      viewerCode = candidate;
      break;
    }
  }

  if (!viewerCode) return { error: 'Could not generate a unique viewer ID.', credentials: null };

  const password = randomString(PASSWORD_ALPHABET, 18);
  const email = `${viewerCode.toLowerCase()}@screening.monarchreport.org`;
  const userMetadata = {
    viewer_code: viewerCode,
    display_name: displayName,
    contact_email: contactEmail,
    context_note: contextNote,
    access_key: password,
  };
  const { data: authData, error: authError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: userMetadata,
  });

  if (authError || !authData.user) {
    return { error: 'Could not create the private viewer account.', credentials: null };
  }

  const viewerRecord = {
    auth_user_id: authData.user.id,
    viewer_code: viewerCode,
    display_name: displayName,
    contact_email: contactEmail,
    context_note: contextNote,
    access_key: password,
  };
  let viewerInsert = await admin.from('screening_viewers').insert(viewerRecord).select('id').single();

  if (viewerInsert.error) {
    viewerInsert = await admin
      .from('screening_viewers')
      .insert({
        auth_user_id: authData.user.id,
        viewer_code: viewerCode,
        display_name: displayName,
        contact_email: contactEmail,
      })
      .select('id')
      .single();
  }

  if (viewerInsert.error) {
    viewerInsert = await admin
      .from('screening_viewers')
      .insert({ auth_user_id: authData.user.id, viewer_code: viewerCode, display_name: displayName })
      .select('id')
      .single();
  }

  const viewer = viewerInsert.data;
  if (viewerInsert.error || !viewer) {
    await admin.auth.admin.deleteUser(authData.user.id);
    return { error: 'Could not save the private viewer account.', credentials: null };
  }

  const expiresAt = new Date(Date.now() + expiresHours * 60 * 60 * 1000).toISOString();
  const { error: grantError } = await admin.from('screening_access_grants').insert({
    viewer_id: viewer.id,
    episode_id: episodeId,
    expires_at: expiresAt,
    view_limit: viewLimit,
    device_limit: deviceLimit,
  });

  if (grantError) {
    await admin.from('screening_viewers').delete().eq('id', viewer.id);
    await admin.auth.admin.deleteUser(authData.user.id);
    return { error: 'Could not issue episode access.', credentials: null };
  }

  revalidatePath('/screening/admin');
  return { error: null, credentials: { viewerCode, password, contactEmail, contextNote } };
}

export async function rotateAccessKeyAction(formData: FormData) {
  await requireAdministrator();
  const viewerId = String(formData.get('viewerId') ?? '');
  if (!viewerId) return;

  const admin = createSupabaseAdminClient();
  const { data: viewer } = await admin
    .from('screening_viewers')
    .select('id, auth_user_id, viewer_code, status')
    .eq('id', viewerId)
    .maybeSingle();

  if (!viewer || viewer.status !== 'active') return;

  const password = randomString(PASSWORD_ALPHABET, 18);
  const { data: authData } = await admin.auth.admin.getUserById(viewer.auth_user_id);
  const { error } = await admin.auth.admin.updateUserById(viewer.auth_user_id, {
    password,
    user_metadata: {
      ...(authData.user?.user_metadata ?? {}),
      viewer_code: viewer.viewer_code,
      access_key: password,
    },
  });
  if (error) return;

  await admin.from('screening_viewers').update({ access_key: password }).eq('id', viewer.id);
  revalidatePath('/screening/admin');
}

export async function revokeViewerAction(formData: FormData) {
  await requireAdministrator();
  const viewerId = String(formData.get('viewerId') ?? '');
  if (!viewerId) return;

  const admin = createSupabaseAdminClient();
  await Promise.all([
    admin.from('screening_viewers').update({ status: 'revoked', revoked_at: new Date().toISOString() }).eq('id', viewerId),
    admin.from('screening_access_grants').update({ status: 'revoked' }).eq('viewer_id', viewerId),
    admin.from('screening_sessions').update({ ended_at: new Date().toISOString() }).eq('viewer_id', viewerId).is('ended_at', null),
  ]);
  revalidatePath('/screening/admin');
}

export async function deleteViewerAction(formData: FormData) {
  await requireAdministrator();
  const viewerId = String(formData.get('viewerId') ?? '');
  if (!viewerId) return;

  const admin = createSupabaseAdminClient();
  const { data: viewer } = await admin
    .from('screening_viewers')
    .select('auth_user_id')
    .eq('id', viewerId)
    .maybeSingle();
  if (!viewer) return;

  await admin.from('screening_sessions').delete().eq('viewer_id', viewerId);
  await admin.from('screening_access_grants').delete().eq('viewer_id', viewerId);
  await admin.from('screening_viewers').delete().eq('id', viewerId);
  await admin.auth.admin.deleteUser(viewer.auth_user_id).catch(() => {
    // The ledger row is already gone; an orphaned auth user only blocks
    // reusing this viewer code's generated email address.
  });
  revalidatePath('/screening/admin');
}
