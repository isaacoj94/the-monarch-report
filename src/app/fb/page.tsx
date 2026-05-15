import type { Metadata } from 'next';
import { HubPage, type HubCta } from '@/components/HubPage';

export const metadata: Metadata = {
  title: 'The Monarch Report — From Facebook',
  description: 'Newsletter, documentary, latest articles, and economic data.',
  robots: { index: false, follow: false },
};

const CTAS: HubCta[] = [
  { label: 'Subscribe to the Newsletter', sublabel: 'The truth about Korea & Japan in your inbox',
    base: '/#newsletter', campaign: 'newsletter-2026', content: 'bio-fb-newsletter', primary: true },
  { label: 'Support the Documentary', sublabel: 'You\'re Next — now raising funds',
    base: 'https://www.theprincipleproject.com/projects/youre-next', campaign: 'youre-next-doc-2026', content: 'bio-fb-doc' },
  { label: 'Watch the Trailer',
    base: '/#trailer', campaign: 'youre-next-doc-2026', content: 'bio-fb-trailer' },
  { label: 'Latest Articles',
    base: '/articles', campaign: 'articles-2026', content: 'bio-fb-articles' },
  { label: 'Economic Dashboard', sublabel: 'KOSPI, FX, gas, unemployment — live',
    base: '/dashboard', campaign: 'dashboard-launch-2026', content: 'bio-fb-dashboard' },
];

export default function FbHub() {
  return <HubPage platform={{ key: 'fb', label: 'From Facebook', tagline: 'Welcome from Facebook. Pick where to go next.' }} ctas={CTAS} />;
}
