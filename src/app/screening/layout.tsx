import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Private Screening | Monarch Films',
  description: 'Invitation-only Monarch Films screening room.',
  robots: { index: false, follow: false, nocache: true },
  openGraph: { title: 'Private Screening | Monarch Films', description: 'Invitation-only screening room.', images: [] },
  twitter: { card: 'summary', title: 'Private Screening | Monarch Films', description: 'Invitation-only screening room.', images: [] },
};

export default function ScreeningLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
