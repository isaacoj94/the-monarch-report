import type { Metadata } from 'next';
import { HubPage } from '@/components/HubPage';
import { standardHubCtas, welcomeTagline } from '@/lib/hub-copy';

export const metadata: Metadata = {
  title: 'The Monarch Report — From YouTube',
  description: 'Newsletter, documentary, latest articles, and economic data.',
  robots: { index: false, follow: false },
};

export default function YouTubeHub() {
  return <HubPage platform={{ key: 'yt', label: 'From YouTube · @monarchreport25', tagline: welcomeTagline('YouTube') }} ctas={standardHubCtas('yt')} />;
}
