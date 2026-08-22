import type { Metadata } from 'next';
import { HubPage } from '@/components/HubPage';
import { standardHubCtas, welcomeTagline } from '@/lib/hub-copy';

export const metadata: Metadata = {
  title: 'The Monarch Report — From Instagram',
  description: 'Newsletter, documentary, latest articles, and economic data.',
  robots: { index: false, follow: false },
};

export default function InstagramHub() {
  return <HubPage platform={{ key: 'ig', label: 'From Instagram · @monarchreport25', tagline: welcomeTagline('Instagram') }} ctas={standardHubCtas('ig')} />;
}
