import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Articles | The Monarch Report',
  description: 'In-depth investigative articles on democracy, religious freedom, and human rights in Korea and Japan.',
};

export default function ArticlesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
