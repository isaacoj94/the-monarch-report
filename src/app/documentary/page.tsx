'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { captureUtms, trackEvent, type UtmPayload } from '@/lib/utm-client';

const SUPPORT_URL = 'https://www.theprincipleproject.com/projects/youre-next';

const COUNTRIES = [
  { code: 'CN', label: 'China',       blurb: 'State surveillance and persecution of underground faith communities.' },
  { code: 'JP', label: 'Japan',       blurb: 'The dissolution order against the Family Federation and what it means for religious freedom.' },
  { code: 'KR', label: 'South Korea', blurb: 'The erosion of democratic norms and the targeting of minority faiths.' },
  { code: 'KP', label: 'North Korea', blurb: 'The most extreme religious persecution on earth — what we can document, and what we can\'t.' },
];

export default function DocumentaryPage() {
  const [utms, setUtms] = useState<UtmPayload>({});

  useEffect(() => {
    setUtms(captureUtms());
  }, []);

  const fireSupportClick = (ctaId: string) => () => {
    trackEvent('documentary_support_click', {
      link_url: SUPPORT_URL,
      source_page: 'documentary',
      cta_id: ctaId,
      ...utms,
    });
  };

  return (
    <main className="min-h-screen bg-tm-page text-tm-body">
      <header className="border-b border-tm-border-subtle">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logos/icon-gold.png" alt="" width={32} height={32} className="w-8 h-8 opacity-80" />
            <span className="font-serif text-sm text-tm-heading">The Monarch Report</span>
          </Link>
          <Link href="/#newsletter" className="text-xs font-mono text-tm-secondary hover:text-tm-heading">Subscribe →</Link>
        </div>
      </header>

      <section className="relative overflow-hidden bg-tm-section">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--tm-hero-glow),transparent_70%)]" />
        <div className="relative max-w-5xl mx-auto px-4 py-14 md:py-20 text-center">
          <span className="text-[10px] font-mono font-bold tracking-widest text-tm-gold bg-[var(--tm-gold-bg)] px-3 py-1 rounded-full border border-[var(--tm-gold-border)] inline-block mb-6">
            NOW RAISING FUNDS
          </span>
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-tm-heading leading-tight mb-4">
            You&apos;re Next: Do Nothing
          </h1>
          <p className="text-lg text-tm-secondary leading-relaxed max-w-2xl mx-auto mb-2">
            A 5-part documentary series on religious persecution across China, Japan, South Korea, and North Korea.
          </p>
          <p className="text-sm text-tm-muted italic max-w-xl mx-auto">
            &ldquo;The only thing necessary for the triumph of evil is for good men to do nothing.&rdquo;
          </p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 py-12">
        <div className="aspect-video rounded-lg overflow-hidden border border-tm-border bg-tm-card">
          <iframe
            src="https://www.youtube.com/embed/S2oRBd0spEo"
            title="You're Next: Do Nothing — Official Trailer"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
          {[
            { label: 'Episodes', value: '5' },
            { label: 'Countries', value: '4' },
            { label: 'Target Release', value: 'Q2 2026' },
            { label: 'Format', value: '22 min each' },
          ].map(stat => (
            <div key={stat.label} className="bg-tm-card/60 border border-tm-border rounded-md px-3 py-3 text-center">
              <p className="text-xl font-serif font-bold text-tm-gold">{stat.value}</p>
              <p className="text-[10px] text-tm-muted tracking-wide uppercase mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 py-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-6 bg-tm-gold rounded-full" />
          <h2 className="text-2xl font-serif font-bold text-tm-heading">The Series</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {COUNTRIES.map(c => (
            <div key={c.code} className="bg-tm-card/60 border border-tm-border rounded-lg p-5">
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-[10px] font-mono text-tm-gold tracking-widest">{c.code}</span>
                <h3 className="text-lg font-serif font-bold text-tm-heading">{c.label}</h3>
              </div>
              <p className="text-sm text-tm-secondary leading-relaxed">{c.blurb}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-tm-border-subtle bg-tm-section">
        <div className="max-w-3xl mx-auto px-4 py-14 text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-tm-heading mb-4">Support the Documentary</h2>
          <p className="text-base text-tm-secondary leading-relaxed max-w-xl mx-auto mb-8">
            We&apos;re raising funds through The Principle Project to take this film into legislators&apos; offices and onto the global stage. Every dollar pushes us closer to release.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href={SUPPORT_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={fireSupportClick('doc-page-primary')}
              className="inline-flex items-center gap-2 px-8 py-4 bg-tm-gold hover:bg-tm-gold-hover text-tm-page font-bold text-base rounded-lg transition-colors"
            >
              Donate via Principle Project →
            </a>
            <Link
              href="/#newsletter"
              className="inline-flex items-center gap-2 px-8 py-4 border border-tm-border-hover hover:border-tm-border-active text-tm-heading text-sm rounded-lg transition-colors"
            >
              Get release updates by email
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 py-14">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-6 bg-tm-gold rounded-full" />
          <h2 className="text-2xl font-serif font-bold text-tm-heading">Why now</h2>
        </div>
        <div className="space-y-4 text-base text-tm-secondary leading-relaxed">
          <p>
            Religious persecution in East Asia is intensifying — and most Western audiences don&apos;t see it. State actors target minority faiths, dissolve organizations under regulatory pretext, and detain leaders under emergency powers, while mainstream coverage stays focused elsewhere.
          </p>
          <p>
            This series brings the evidence into a single film designed for legislators, policymakers, and the public. We can&apos;t change what we don&apos;t see.
          </p>
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href={SUPPORT_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={fireSupportClick('doc-page-bottom')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-tm-gold hover:bg-tm-gold-hover text-tm-page font-bold text-sm rounded transition-colors"
          >
            Donate via Principle Project →
          </a>
          <Link
            href="/articles"
            className="inline-flex items-center gap-2 px-6 py-3 border border-tm-border-hover hover:border-tm-border-active text-tm-heading text-sm rounded transition-colors"
          >
            Read our reporting
          </Link>
        </div>
      </section>

      <footer className="border-t border-tm-border-subtle">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center text-[10px] font-mono text-tm-dim">
          The Monarch Report · Defending Democracy, Faith &amp; Freedom · monarchreport.org
        </div>
      </footer>
    </main>
  );
}
