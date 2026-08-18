import { NextResponse } from 'next/server';
import { DESK_COOKIE, deskPassword, deskToken } from '@/lib/desk/auth';

export async function POST(request: Request) {
  const password = deskPassword();
  if (!password) {
    return NextResponse.json({ error: 'Desk is not configured' }, { status: 404 });
  }

  const body = (await request.json().catch(() => null)) as { password?: string } | null;
  if (body?.password !== password) {
    return NextResponse.json({ error: 'Incorrect password' }, { status: 401 });
  }

  const token = await deskToken(password);
  const response = NextResponse.json({ ok: true });
  response.cookies.set(DESK_COOKIE, token ?? '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 14,
  });
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(DESK_COOKIE, '', { path: '/', maxAge: 0 });
  return response;
}
