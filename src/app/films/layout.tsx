import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "You're Next: Do Nothing | Monarch Films",
  description: 'Watch Episode 1, Inside the Machine: a cinematic investigation into how China erases independent faith.',
  openGraph: {
    title: "Inside the Machine | Episode 1",
    description: 'Watch Episode 1 of You’re Next: Do Nothing, from Monarch Films.',
    type: 'video.movie',
    images: [{ url: '/social/episode-01-launch-x-1600x900.png', alt: "Inside the Machine — Episode 1 of You’re Next: Do Nothing" }],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Inside the Machine | Episode 1",
    description: 'Watch Episode 1 of You’re Next: Do Nothing, from Monarch Films.',
    images: ['/social/episode-01-launch-x-1600x900.png'],
  },
};

export default function DocumentaryLayout({ children }: Readonly<{ children: React.ReactNode }>) { return children; }
