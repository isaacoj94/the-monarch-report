// SMM shortlink catalog + UTM builder.
// Captions/Stories/DMs use /r/<slug>; the route handler at src/app/r/[...slug]/route.ts
// resolves these to fully UTM'd destinations. Hub pages (src/app/{x,ig,yt,tt,fb,policy})
// also use buildUtm() to pre-bake UTMs into their CTA hrefs.
//
// Strict vocabulary — anything outside this pollutes BQ/GA4 cohorts. See
// project_runqiao_du_link_strategy in memory for the parallel runqiaodu playbook.

export type UtmParams = {
  source: string;
  medium: string;
  campaign: string;
  content: string;
};

const SITE_ORIGIN = 'https://monarchreport.org';

export function buildUtm(base: string, p: UtmParams): string {
  const isAbsolute = /^https?:\/\//i.test(base);
  const u = new URL(base, SITE_ORIGIN);
  u.searchParams.set('utm_source', p.source);
  u.searchParams.set('utm_medium', p.medium);
  u.searchParams.set('utm_campaign', p.campaign);
  u.searchParams.set('utm_content', p.content);
  if (isAbsolute) return u.toString();
  return u.pathname + u.search + (u.hash || '');
}

export type Shortlink = {
  base: string;
  campaign: string;
  // Default medium when accessed via /r/<slug>. DM variants override to 'dm'
  // automatically when slug is /r/dm/<slug>.
  medium: 'post' | 'story' | 'reel' | 'thread' | 'bio';
};

// Story / post / reel use. Captions, on-screen text, descriptions.
// DM use: prefix with `dm/` in the URL — same destination, utm_medium=dm.
export const SHORTLINKS: Record<string, Shortlink> = {
  newsletter: { base: '/#newsletter',                                                campaign: 'newsletter-2026',          medium: 'story' },
  doc:        { base: 'https://www.theprincipleproject.com/projects/youre-next',     campaign: 'youre-next-doc-2026',      medium: 'story' },
  trailer:    { base: '/#trailer',                                                   campaign: 'youre-next-doc-2026',      medium: 'story' },
  faith:      { base: '/#faith',                                                     campaign: 'faith-under-fire-2026',    medium: 'story' },
  japan:      { base: '/#japan',                                                     campaign: 'japan-watch-2026',         medium: 'story' },
  democracy:  { base: '/#democracy',                                                 campaign: 'democracy-watch-2026',     medium: 'story' },
  economy:    { base: '/#economy',                                                   campaign: 'economy-watch-2026',       medium: 'story' },
  dashboard:  { base: '/dashboard',                                                  campaign: 'dashboard-launch-2026',    medium: 'story' },
  articles:   { base: '/articles',                                                   campaign: 'articles-2026',            medium: 'story' },
  x:          { base: 'https://x.com/monarchreport25',                               campaign: 'follow-2026',              medium: 'story' },
  ig:         { base: 'https://www.instagram.com/monarchreport25/',                  campaign: 'follow-2026',              medium: 'story' },
  yt:         { base: 'https://www.youtube.com/@monarchreport25',                    campaign: 'follow-2026',              medium: 'story' },
  tt:         { base: 'https://www.tiktok.com/@monarchreport25',                     campaign: 'follow-2026',              medium: 'story' },
  fb:         { base: 'https://www.facebook.com/profile.php?id=61581485848456',      campaign: 'follow-2026',              medium: 'story' },
};

export function resolveShortlink(slugPath: string): string | null {
  const isDm = slugPath.startsWith('dm/');
  const key = isDm ? slugPath.slice(3) : slugPath;
  const entry = SHORTLINKS[key];
  if (!entry) return null;
  return buildUtm(entry.base, {
    source: 'social',
    medium: isDm ? 'dm' : entry.medium,
    campaign: entry.campaign,
    content: isDm ? `r-dm-${key}` : `r-${key}`,
  });
}
