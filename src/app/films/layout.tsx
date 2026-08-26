import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "You're Next: Do Nothing | Monarch Films",
  description: 'A three-part cinematic investigation into religious persecution across China, Japan and South Korea. Episode 1 premieres August 28 at 8 PM ET.',
  openGraph: {
    title: "You're Next: Do Nothing",
    description: 'Episode 1 premieres publicly August 28 at 8 PM ET on YouTube, X and Facebook.',
    type: 'video.movie',
    images: [{ url: '/social/episode-01-launch-x-1600x900.png', alt: "Inside the Machine — Episode 1 premieres August 28 at 8 PM ET" }],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Inside the Machine | Episode 1",
    description: 'Premieres publicly August 28 at 8 PM ET on YouTube, X and Facebook.',
    images: ['/social/episode-01-launch-x-1600x900.png'],
  },
};

export default function DocumentaryLayout({ children }: Readonly<{ children: React.ReactNode }>) { return children; }
