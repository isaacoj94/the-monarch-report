import Link from 'next/link';
import Image from 'next/image';
import inbox from '@/data/desk/inbox.json';
import type { DeskInbox } from '@/lib/desk/types';
import ThemeToggle from '@/components/ThemeToggle';

export const metadata = {
  title: "What's Happening Now | The Monarch Report",
  description:
    'Verified briefings on Korea and religious freedom in Asia. Events appear only after editorial approval.',
};

const data = inbox as DeskInbox;
const live = data.events.filter((event) => event.reviewState === 'approved');

export default function NowPage() {
  return (
    <div className="min-h-screen bg-tm-page">
      <header className="sticky top-0 z-50 bg-tm-page/95 backdrop-blur-sm border-b border-tm-border-subtle">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <Image src="/logos/combined-gold.png" alt="The Monarch Report" width={554} height={80} className="h-7 w-auto" priority />
          </Link>
          <div className="flex items-center gap-3 text-xs font-mono">
            <Link href="/articles" className="text-tm-secondary hover:text-tm-heading">Articles</Link>
            <Link href="/" className="text-tm-secondary hover:text-tm-heading">Home</Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-12">
        <p className="text-[10px] font-mono tracking-widest text-tm-gold mb-2">EVIDENCE DESK</p>
        <h1 className="text-3xl font-bold text-tm-heading mb-3">What&apos;s Happening Now</h1>
        <p className="text-sm text-tm-secondary font-mono max-w-2xl mb-10">
          An English-language evidence desk for Korea and religious freedom in Asia. Briefings are clustered
          events — not a replicated X timeline — and only appear after a human editor approves them.
        </p>

        {live.length === 0 ? (
          <div className="bg-tm-card border border-tm-border rounded-lg p-6">
            <p className="text-tm-heading font-bold mb-2">No approved briefings yet</p>
            <p className="text-sm text-tm-secondary leading-relaxed">
              The collector stores raw X posts and OpenRouter discoveries as unpublished drafts. Political
              allegations, persecution claims, and single-source posts stay in the desk until an editor
              corroborates them. The public archive of earlier X Articles remains on the{' '}
              <Link href="/articles" className="text-tm-gold">Articles</Link> page.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {live.map((event) => (
              <article key={event.id} className="bg-tm-card border border-tm-border rounded-lg p-5">
                <div className="flex items-center gap-2 mb-2 text-[10px] font-mono">
                  <span className="text-tm-gold">{event.status}</span>
                  <span className="text-tm-muted">
                    Checked {new Date(event.lastCheckedAt).toLocaleString()}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-tm-heading">{event.title}</h2>
                <p className="text-sm text-tm-secondary mt-2">{event.summary}</p>
                {event.individualImpact && (
                  <p className="text-sm mt-3"><span className="text-tm-muted font-mono text-[11px]">Individuals. </span>{event.individualImpact}</p>
                )}
                {event.companyImpact && (
                  <p className="text-sm mt-1"><span className="text-tm-muted font-mono text-[11px]">Companies. </span>{event.companyImpact}</p>
                )}
                {event.unverified && (
                  <p className="text-sm mt-3 text-tm-muted">Unverified: {event.unverified}</p>
                )}
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
