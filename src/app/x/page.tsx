import type { Metadata } from 'next';
import { HubPage } from '@/components/HubPage';
import { standardHubCtas, welcomeTagline } from '@/lib/hub-copy';

export const metadata: Metadata = {
  title: 'The Monarch Report — From X',
  description: 'Newsletter, documentary, latest articles, and economic data.',
  robots: { index: false, follow: false },
};

export default function XHub() {
  return <HubPage platform={{ key: 'x', label: 'From X · @monarchreport25', tagline: welcomeTagline('X') }} ctas={standardHubCtas('x')} />;
}
