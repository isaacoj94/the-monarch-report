import type { Metadata } from 'next';
import { HubPage, type HubCta } from '@/components/HubPage';

export const metadata: Metadata = {
  title: 'The Monarch Report — For Policymakers',
  description: 'Briefings, data, and reporting on Korea and Japan for legislators and staff.',
  robots: { index: false, follow: false },
};

const CTAS: HubCta[] = [
  { label: 'Subscribe to Policy Briefings', sublabel: 'Curated reporting for legislators and staff',
    base: '/#newsletter', campaign: 'policy-briefings-2026', content: 'bio-policy-newsletter', primary: true },
  { label: 'Economic Dashboard', sublabel: 'KOSPI, FX, gas, youth unemployment — citation-ready',
    base: '/dashboard', campaign: 'dashboard-launch-2026', content: 'bio-policy-dashboard' },
  { label: 'Latest Reporting',
    base: '/articles', campaign: 'articles-2026', content: 'bio-policy-articles' },
  { label: 'Support the Documentary', sublabel: 'You\'re Next — independent reporting on Korea',
    base: 'https://www.theprincipleproject.com/projects/youre-next', campaign: 'youre-next-doc-2026', content: 'bio-policy-doc' },
];

export default function PolicyHub() {
  return <HubPage platform={{ key: 'policy', label: 'For Policymakers', tagline: 'A resource for U.S. legislators and policy staff. Briefings, data, reporting.' }} ctas={CTAS} />;
}
