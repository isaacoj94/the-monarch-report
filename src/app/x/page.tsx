import type { Metadata } from 'next';
import { HubPage, type HubCta } from '@/components/HubPage';

export const metadata: Metadata = {
  title: 'The Monarch Report — From X',
  description: 'Newsletter, documentary, latest articles, and economic data.',
  robots: { index: false, follow: false },
};

const CTAS: HubCta[] = [
  { label: 'Subscribe to the Newsletter', sublabel: 'The truth about Korea & Japan in your inbox',
    base: '/#newsletter', campaign: 'newsletter-2026', content: 'bio-x-newsletter', primary: true },
  { label: 'Support the Documentary', sublabel: 'You\'re Next — now raising funds',
    base: 'https://www.theprincipleproject.com/projects/youre-next', campaign: 'youre-next-doc-2026', content: 'bio-x-doc' },
  { label: 'Watch the Trailer',
    base: '/#trailer', campaign: 'youre-next-doc-2026', content: 'bio-x-trailer' },
  { label: 'Latest Articles',
    base: '/articles', campaign: 'articles-2026', content: 'bio-x-articles' },
  { label: 'Economic Dashboard', sublabel: 'KOSPI, FX, gas, unemployment — live',
    base: '/dashboard', campaign: 'dashboard-launch-2026', content: 'bio-x-dashboard' },
];

export default function XHub() {
  return <HubPage platform={{ key: 'x', label: 'From X · @monarchreport25', tagline: 'Welcome from X. Pick where to go next.' }} ctas={CTAS} />;
}
