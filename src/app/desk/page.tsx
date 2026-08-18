import Link from 'next/link';
import inbox from '@/data/desk/inbox.json';
import cursor from '@/data/desk/cursor.json';
import type { DeskInbox } from '@/lib/desk/types';

export const metadata = {
  title: 'Editorial desk | The Monarch Report',
  robots: { index: false, follow: false },
};

const data = inbox as DeskInbox;

export default function DeskPage() {
  const raw = data.rawItems;
  const events = data.events;
  const pending = events.filter((event) => event.reviewState !== 'approved');

  return (
    <div className="min-h-screen bg-tm-page">
      <header className="border-b border-tm-border-subtle">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-mono tracking-widest text-tm-gold">UNPUBLISHED</p>
            <h1 className="text-xl font-bold text-tm-heading">Editorial desk</h1>
          </div>
          <div className="text-right text-[11px] font-mono text-tm-muted space-y-1">
            <p>Last run {cursor.lastRunAt ? new Date(cursor.lastRunAt).toLocaleString() : 'never'}</p>
            <p>
              Spend {cursor.spendDay}: ${Number(cursor.spendUsd || 0).toFixed(4)}
            </p>
            <Link href="/" className="text-tm-gold">
              Public site →
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-10">
        {cursor.lastError && (
          <p className="text-sm font-mono text-red-400 border border-red-900/50 rounded p-3">{cursor.lastError}</p>
        )}

        <section>
          <h2 className="text-sm font-mono tracking-widest text-tm-secondary mb-3">
            EVENT DRAFTS ({pending.length})
          </h2>
          {pending.length === 0 ? (
            <p className="text-sm text-tm-muted font-mono">
              No event drafts yet. Collection writes here only after a GitHub Action run with
              OPENROUTER_API_KEY or X_BEARER_TOKEN. Nothing auto-publishes.
            </p>
          ) : (
            <div className="space-y-3">
              {pending.map((event) => (
                <article key={event.id} className="bg-tm-card border border-tm-border rounded-lg p-4">
                  <div className="flex flex-wrap items-center gap-2 mb-2 text-[10px] font-mono">
                    <span className="text-tm-gold border border-[var(--tm-gold-border)] px-1.5 py-0.5 rounded">
                      {event.status}
                    </span>
                    <span className="text-tm-muted">{event.reviewState}</span>
                    <span className="text-tm-muted">{event.urgency}</span>
                  </div>
                  <h3 className="text-tm-heading font-bold">{event.title}</h3>
                  <p className="text-sm text-tm-secondary mt-1">{event.summary}</p>
                  {event.sourceUrls[0] && (
                    <a
                      href={event.sourceUrls[0]}
                      className="text-[11px] font-mono text-tm-gold mt-2 inline-block break-all"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {event.sourceUrls[0]}
                    </a>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="text-sm font-mono tracking-widest text-tm-secondary mb-3">RAW ITEMS ({raw.length})</h2>
          {raw.length === 0 ? (
            <p className="text-sm text-tm-muted font-mono">Inbox empty.</p>
          ) : (
            <ul className="space-y-2">
              {raw.slice(0, 40).map((item) => (
                <li key={item.id} className="border border-tm-border-subtle rounded p-3 text-sm">
                  <div className="flex flex-wrap gap-2 text-[10px] font-mono text-tm-muted mb-1">
                    <span>{item.collector}</span>
                    <span>{item.handle || 'unknown'}</span>
                    <span>{item.beat}</span>
                    {item.hasArticle && <span className="text-tm-gold">X ARTICLE</span>}
                  </div>
                  <p className="text-tm-heading">{item.text.slice(0, 240)}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}
