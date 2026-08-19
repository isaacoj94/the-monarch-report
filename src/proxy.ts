import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

const DEVICE_COOKIE = 'mr_screening_device';

function attachDeviceCookie(request: NextRequest, response: NextResponse) {
  const existingDeviceId = request.cookies.get(DEVICE_COOKIE)?.value;
  response.cookies.set(DEVICE_COOKIE, existingDeviceId || crypto.randomUUID(), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
  });
  return response;
}

export async function proxy(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) return attachDeviceCookie(request, NextResponse.next({ request }));

  let response = NextResponse.next({ request });
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        response.headers.set('Cache-Control', 'private, no-store');
      },
    },
  });

  await supabase.auth.getClaims();
  return attachDeviceCookie(request, response);
}

export const config = {
  matcher: ['/screening/:path*', '/api/screening/:path*'],
};
