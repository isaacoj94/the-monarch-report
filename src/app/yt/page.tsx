import type { Metadata } from 'next';
import { HubPage, type HubCta } from '@/components/HubPage';

export const metadata: Metadata = {
  title: 'The Monarch Report — From YouTube',
  description: 'Newsletter, documentary, latest articles, and economic data.',
  robots: { index: false, follow: false },
};

const CTAS: HubCta[] = [
  { label: 'Subscribe to the Newsletter', sublabel: 'The truth about Korea & Japan in your inbox',
    base: '/#newsletter', campaign: 'newsletter-2026', content: 'bio-yt-newsletter', primary: true },
  { label: 'Support the Documentary', sublabel: 'You\'re Next — now raising funds',
    base: 'https://www.theprincipleproject.com/projects/youre-next', campaign: 'youre-next-doc-2026', content: 'bio-yt-doc' },
  { label: 'Watch the Trailer',
    base: '/#trailer', campaign: 'youre-next-doc-2026', content: 'bio-yt-trailer' },
  { label: 'Latest Articles',
    base: '/articles', campaign: 'articles-2026', content: 'bio-yt-articles' },
  { label: 'Economic Dashboard', sublabel: 'KOSPI, FX, gas, unemployment — live',
    base: '/dashboard', campaign: 'dashboard-launch-2026', content: 'bio-yt-dashboard' },
];

export default function YtHub() {
  return <HubPage platform={{ key: 'yt', label: 'From YouTube · @monarchreport25', tagline: 'Welcome from YouTube. Pick where to go next.' }} ctas={CTAS} />;
}
