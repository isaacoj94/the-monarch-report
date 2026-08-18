import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { DESK_COOKIE, deskPassword, deskTokenMatches } from '@/lib/desk/auth';

export async function proxy(request: NextRequest) {
  if (!request.nextUrl.pathname.startsWith('/desk')) {
    return NextResponse.next();
  }

  if (request.nextUrl.pathname.startsWith('/desk/login')) {
    return NextResponse.next();
  }

  if (!deskPassword()) {
    if (process.env.NODE_ENV !== 'production') return NextResponse.next();
    return new NextResponse('Not found', { status: 404 });
  }

  if (await deskTokenMatches(request.cookies.get(DESK_COOKIE)?.value)) {
    return NextResponse.next();
  }

  const login = new URL('/desk/login', request.url);
  login.searchParams.set('next', request.nextUrl.pathname);
  return NextResponse.redirect(login);
}

export const config = {
  matcher: ['/desk/:path*'],
};
