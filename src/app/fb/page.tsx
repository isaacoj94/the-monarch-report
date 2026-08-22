import type { Metadata } from 'next';
import { HubPage } from '@/components/HubPage';
import { standardHubCtas, welcomeTagline } from '@/lib/hub-copy';

export const metadata: Metadata = {
  title: 'The Monarch Report — From Facebook',
  description: 'Newsletter, documentary, latest articles, and economic data.',
  robots: { index: false, follow: false },
};

export default function FacebookHub() {
  return <HubPage platform={{ key: 'fb', label: 'From Facebook', tagline: welcomeTagline('Facebook') }} ctas={standardHubCtas('fb')} />;
}
