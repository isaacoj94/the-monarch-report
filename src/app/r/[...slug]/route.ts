import { NextResponse } from 'next/server';
import { resolveShortlink } from '@/lib/shortlinks';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string[] }> },
) {
  const { slug } = await params;
  const key = slug.join('/');
  const dest = resolveShortlink(key);
  if (!dest) {
    return NextResponse.redirect(
      new URL(`/?missing-shortlink=${encodeURIComponent(key)}`, 'https://monarchreport.org'),
      302,
    );
  }
  const url = /^https?:\/\//i.test(dest) ? dest : new URL(dest, 'https://monarchreport.org').toString();
  return NextResponse.redirect(url, 302);
}
