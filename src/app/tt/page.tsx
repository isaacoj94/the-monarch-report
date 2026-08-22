import type { Metadata } from 'next';
import { HubPage } from '@/components/HubPage';
import { standardHubCtas, welcomeTagline } from '@/lib/hub-copy';

export const metadata: Metadata = {
  title: 'The Monarch Report — From TikTok',
  description: 'Newsletter, documentary, latest articles, and economic data.',
  robots: { index: false, follow: false },
};

export default function TikTokHub() {
  return <HubPage platform={{ key: 'tt', label: 'From TikTok · @monarchreport25', tagline: welcomeTagline('TikTok') }} ctas={standardHubCtas('tt')} />;
}
