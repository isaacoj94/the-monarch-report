import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "You're Next: Do Nothing | Monarch Films",
  description: 'A five-part cinematic investigation into religious persecution across China, Japan, South Korea and North Korea.',
  openGraph: {
    title: "You're Next: Do Nothing",
    description: 'A Monarch Films production built from testimony, court records and cinematic reconstruction.',
    type: 'video.movie',
    images: [{ url: '/images/cinematic-citizen.jpg', alt: "You're Next: Do Nothing — A Monarch Films production" }],
  },
  twitter: {
    card: 'summary_large_image',
    title: "You're Next: Do Nothing",
    description: 'A Monarch Films production.',
    images: ['/images/cinematic-citizen.jpg'],
  },
};

export default function DocumentaryLayout({ children }: Readonly<{ children: React.ReactNode }>) { return children; }
