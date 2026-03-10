'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { featuredContent, siteConfig, newsletter, xHandle, instagramHandle } from '@/lib/content';
import { walletMetrics, macroMetrics } from '@/lib/data';

interface ExchangeData {
  rate: number;
}

export default function Home() {
  const [liveRate, setLiveRate] = useState<number | null>(null);
  const [email, setEmail] = useState('');
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const xTimelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/exchange-rate').then(r => r.json()).then((d: ExchangeData) => setLiveRate(d.rate)).catch(() => {});
  }, []);

  // Load X embed script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://platform.twitter.com/widgets.js';
    script.async = true;
    script.charset = 'utf-8';
    document.body.appendChild(script);
    return () => { document.body.removeChild(script); };
  }, []);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: integrate with email provider (Buttondown/ConvertKit/Mailchimp)
    setEmailSubmitted(true);
  };

  const hero = featuredContent;

  return (
    <div className="min-h-screen bg-[#080808]">
      {/* === HEADER === */}
      <header className="sticky top-0 z-50 bg-[#080808]/95 backdrop-blur-sm border-b border-[#1a1a1a]">
        <div className="max-w-7xl mx-auto px-4">
          {/* Ticker bar */}
          <div className="flex items-center justify-between py-1.5 border-b border-[#141414] text-[10px] font-mono text-[#666]">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="relative flex h-1.5 w-1.5"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" /><span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500" /></span>
                USD/KRW {liveRate ? `₩${liveRate.toLocaleString(undefined, { maximumFractionDigits: 0 })}` : '---'}
              </span>
              <span>Gas ₩{walletMetrics.gasPrice.currentValue.toLocaleString()}/L</span>
              <span>CPI {macroMetrics.inflation.currentValue}%</span>
            </div>
            <a href="/dashboard" className="text-[#888] hover:text-white transition-colors">Economic Dashboard →</a>
          </div>

          {/* Main nav */}
          <div className="flex items-center justify-between py-3">
            <a href="/" className="flex items-center gap-3">
              <Image src="/logos/icon-gold.png" alt="M" width={36} height={36} className="w-9 h-9" />
              <Image src="/logos/word-gold.png" alt="The Monarch Report" width={200} height={24} className="h-5 w-auto hidden sm:block" />
            </a>
            <nav className="flex items-center gap-1 text-xs font-mono">
              <a href="#latest" className="px-3 py-1.5 text-[#999] hover:text-white transition-colors">Latest</a>
              <a href="#articles" className="px-3 py-1.5 text-[#999] hover:text-white transition-colors">Articles</a>
              <a href="#reels" className="px-3 py-1.5 text-[#999] hover:text-white transition-colors">Video</a>
              <a href="/dashboard" className="px-3 py-1.5 text-[#999] hover:text-white transition-colors">Data</a>
              <a href="#about" className="px-3 py-1.5 text-[#999] hover:text-white transition-colors">About</a>
              <a href="#newsletter" className="px-3 py-1.5 bg-[#b8860b] hover:bg-[#d4a017] text-black font-bold rounded transition-colors ml-2">Subscribe</a>
            </nav>
          </div>
        </div>
      </header>

      {/* === HERO: Documentary / Featured Push === */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#111] to-[#080808]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(184,134,11,0.08),transparent_70%)]" />
        <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-6">
              <span className="text-[10px] font-mono font-bold tracking-widest text-[#b8860b] bg-[#b8860b15] px-3 py-1 rounded-full border border-[#b8860b30]">
                {hero.tag}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.08] mb-4 text-white">
              {hero.title}
            </h1>
            <p className="text-lg md:text-xl text-[#999] leading-relaxed mb-3">
              {hero.subtitle}
            </p>
            <p className="text-sm text-[#666] leading-relaxed max-w-2xl mb-8">
              {hero.description}
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href={hero.ctaUrl}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#b8860b] hover:bg-[#d4a017] text-black font-mono font-bold text-sm rounded transition-colors"
              >
                {hero.ctaText} →
              </a>
              {hero.secondaryCta && (
                <a
                  href={hero.secondaryCta.url}
                  className="inline-flex items-center gap-2 px-6 py-3 border border-[#333] hover:border-[#555] text-white font-mono text-sm rounded transition-colors"
                >
                  ▶ {hero.secondaryCta.text}
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* === MISSION STATEMENT BAR === */}
      <section className="border-y border-[#1a1a1a] bg-[#0c0c0c]">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-1 h-10 bg-[#b8860b] rounded-full" />
              <div>
                <p className="text-white font-mono text-sm font-bold">{siteConfig.tagline}</p>
                <p className="text-[#666] text-xs font-mono">Independent journalism · Trusted by U.S. legislators · Fact-based reporting</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono">
              <a href={siteConfig.x} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-[#888] hover:text-white transition-colors px-3 py-1.5 border border-[#222] rounded hover:border-[#444]">
                𝕏 Follow
              </a>
              <a href={siteConfig.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-[#888] hover:text-white transition-colors px-3 py-1.5 border border-[#222] rounded hover:border-[#444]">
                IG Follow
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* === LATEST FROM X === */}
      <section id="latest" className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-1 h-6 bg-[#b8860b] rounded-full" />
            <div>
              <h2 className="text-xl font-bold text-white">Latest</h2>
              <p className="text-[#666] text-xs font-mono">Live from @{xHandle}</p>
            </div>
          </div>
          <a href={siteConfig.x} target="_blank" rel="noopener noreferrer" className="text-xs font-mono text-[#888] hover:text-white transition-colors">
            View all on 𝕏 →
          </a>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* X Timeline embed — main column */}
          <div className="lg:col-span-2" ref={xTimelineRef}>
            <div className="bg-[#111] border border-[#222] rounded-lg overflow-hidden">
              <a
                className="twitter-timeline"
                data-theme="dark"
                data-chrome="noheader nofooter noborders transparent"
                data-height="700"
                data-width="100%"
                href={`https://twitter.com/${xHandle}`}
              >
                Loading posts from @{xHandle}...
              </a>
            </div>
          </div>

          {/* Sidebar — quick info */}
          <div className="space-y-4">
            {/* Data highlights */}
            <div className="bg-[#111] border border-[#222] rounded-lg p-4">
              <h3 className="text-xs font-mono text-[#888] uppercase tracking-wider mb-3">Economic Snapshot</h3>
              <div className="space-y-3">
                {[
                  { label: 'USD/KRW', value: liveRate ? `₩${liveRate.toLocaleString(undefined, { maximumFractionDigits: 0 })}` : `₩${macroMetrics.usdKrw.currentValue}`, color: '#3b82f6', live: !!liveRate },
                  { label: 'Gas/Liter', value: `₩${walletMetrics.gasPrice.currentValue.toLocaleString()}`, color: '#ef4444' },
                  { label: 'Inflation', value: `${macroMetrics.inflation.currentValue}%`, color: '#eab308' },
                  { label: 'Household Debt/GDP', value: `${macroMetrics.householdDebt.currentValue}%`, color: '#ef4444' },
                  { label: 'Youth Unemployment', value: `${macroMetrics.youthUnemployment.currentValue}%`, color: '#a855f7' },
                ].map(item => (
                  <div key={item.label} className="flex items-center justify-between">
                    <span className="text-[#888] text-xs font-mono">{item.label}</span>
                    <div className="flex items-center gap-1.5">
                      {item.live && <span className="relative flex h-1.5 w-1.5"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" /><span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-blue-500" /></span>}
                      <span className="text-xs font-mono font-bold" style={{ color: item.color }}>{item.value}</span>
                    </div>
                  </div>
                ))}
              </div>
              <a href="/dashboard" className="block mt-4 text-center text-[10px] font-mono text-[#b8860b] hover:text-[#d4a017] border border-[#222] hover:border-[#b8860b40] rounded py-2 transition-colors">
                Full Economic Dashboard →
              </a>
            </div>

            {/* Newsletter mini */}
            <div className="bg-[#111] border border-[#222] rounded-lg p-4">
              <h3 className="text-xs font-mono text-[#888] uppercase tracking-wider mb-2">Newsletter</h3>
              <p className="text-[#666] text-[11px] font-mono mb-3">Get weekly analysis delivered to your inbox.</p>
              {emailSubmitted ? (
                <p className="text-[#b8860b] text-xs font-mono">Thank you — we&apos;ll be in touch.</p>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    className="flex-1 bg-[#0a0a0a] border border-[#222] rounded px-3 py-2 text-xs font-mono text-white placeholder:text-[#444] focus:border-[#b8860b] focus:outline-none transition-colors"
                  />
                  <button type="submit" className="px-3 py-2 bg-[#b8860b] hover:bg-[#d4a017] text-black text-xs font-mono font-bold rounded transition-colors">
                    Go
                  </button>
                </form>
              )}
            </div>

            {/* About teaser */}
            <div className="bg-[#111] border border-[#222] rounded-lg p-4">
              <h3 className="text-xs font-mono text-[#888] uppercase tracking-wider mb-2">Who We Are</h3>
              <p className="text-[#999] text-[11px] font-mono leading-relaxed">
                {siteConfig.description}
              </p>
              <a href="#about" className="block mt-3 text-[10px] font-mono text-[#b8860b] hover:text-[#d4a017] transition-colors">
                Learn more →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* === FEATURED ARTICLES === */}
      <section id="articles" className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-1 h-6 bg-red-500 rounded-full" />
            <div>
              <h2 className="text-xl font-bold text-white">Original Reporting</h2>
              <p className="text-[#666] text-xs font-mono">In-depth articles by The Monarch Report</p>
            </div>
          </div>
        </div>

        <div className="bg-[#111] border border-[#222] rounded-lg p-8 text-center">
          <p className="text-[#555] font-mono text-sm mb-4">
            Articles will automatically appear here from your X long-form posts.
          </p>
          <p className="text-[#444] font-mono text-xs mb-4">
            To feature articles, add their tweet IDs to <code className="text-[#b8860b]">src/lib/content.ts</code> → <code className="text-[#b8860b]">xArticles</code>
          </p>
          <a href={siteConfig.x} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-xs font-mono text-[#b8860b] hover:text-[#d4a017] border border-[#222] hover:border-[#b8860b40] rounded px-4 py-2 transition-colors">
            Read articles on 𝕏 →
          </a>
        </div>
      </section>

      {/* === INSTAGRAM REELS === */}
      <section id="reels" className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-1 h-6 bg-pink-500 rounded-full" />
            <div>
              <h2 className="text-xl font-bold text-white">Video</h2>
              <p className="text-[#666] text-xs font-mono">Commentary & analysis from @{instagramHandle}</p>
            </div>
          </div>
          <a href={siteConfig.instagram} target="_blank" rel="noopener noreferrer" className="text-xs font-mono text-[#888] hover:text-white transition-colors">
            View all on Instagram →
          </a>
        </div>

        <div className="bg-[#111] border border-[#222] rounded-lg p-8 text-center">
          <p className="text-[#555] font-mono text-sm mb-4">
            Instagram Reels will be embedded here.
          </p>
          <p className="text-[#444] font-mono text-xs mb-4">
            Instagram requires an access token for API access. Once configured, reels auto-populate.
          </p>
          <a href={siteConfig.instagram} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-xs font-mono text-[#b8860b] hover:text-[#d4a017] border border-[#222] hover:border-[#b8860b40] rounded px-4 py-2 transition-colors">
            Watch on Instagram →
          </a>
        </div>
      </section>

      {/* === NEWSLETTER (Full section) === */}
      <section id="newsletter" className="border-y border-[#1a1a1a] bg-[#0c0c0c]">
        <div className="max-w-3xl mx-auto px-4 py-16 text-center">
          <Image src="/logos/icon-gold.png" alt="" width={48} height={48} className="w-12 h-12 mx-auto mb-6 opacity-60" />
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">{newsletter.title}</h2>
          <p className="text-[#888] font-mono text-sm mb-6 max-w-md mx-auto">{newsletter.subtitle}</p>
          {emailSubmitted ? (
            <p className="text-[#b8860b] font-mono text-sm">Thank you for subscribing. We&apos;ll be in touch soon.</p>
          ) : (
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="flex-1 bg-[#0a0a0a] border border-[#333] rounded-lg px-4 py-3 text-sm font-mono text-white placeholder:text-[#555] focus:border-[#b8860b] focus:outline-none transition-colors"
              />
              <button type="submit" className="px-6 py-3 bg-[#b8860b] hover:bg-[#d4a017] text-black font-mono font-bold text-sm rounded-lg transition-colors">
                Subscribe
              </button>
            </form>
          )}
          <p className="text-[#444] text-[10px] font-mono mt-3">{newsletter.disclaimer}</p>
        </div>
      </section>

      {/* === ABOUT === */}
      <section id="about" className="max-w-7xl mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1 h-6 bg-[#b8860b] rounded-full" />
            <h2 className="text-xl font-bold text-white">About The Monarch Report</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8 text-sm font-mono text-[#999] leading-relaxed">
            <div>
              <h3 className="text-white font-bold mb-3">Our Mission</h3>
              <p className="mb-4">
                The Monarch Report exists to bring the truth about Korea and Japan to Western audiences — especially legislators, policymakers, and citizens who care about democracy, human rights, and religious freedom in East Asia.
              </p>
              <p>
                We are social-first journalists. Our reporting originates on X and Instagram, where we reach hundreds of thousands of people with fact-based analysis that mainstream media won&apos;t cover.
              </p>
            </div>
            <div>
              <h3 className="text-white font-bold mb-3">Our Values</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <span className="text-[#b8860b] mt-0.5">◆</span>
                  <span><strong className="text-white">Democracy</strong> — We believe in transparent governance and the right of the people to hold their leaders accountable.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#b8860b] mt-0.5">◆</span>
                  <span><strong className="text-white">Freedom of Speech</strong> — The truth must never be silenced. We report what others are afraid to say.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#b8860b] mt-0.5">◆</span>
                  <span><strong className="text-white">Freedom of Religion</strong> — Religious persecution in any form is an assault on human dignity. We expose it.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#b8860b] mt-0.5">◆</span>
                  <span><strong className="text-white">Facts First</strong> — Every claim we make is backed by evidence. We show our sources.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* === FOOTER === */}
      <footer className="border-t border-[#1a1a1a] bg-[#060606]">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="flex flex-col md:flex-row items-start justify-between gap-8">
            <div className="flex items-center gap-3">
              <Image src="/logos/icon-gold.png" alt="" width={28} height={28} className="w-7 h-7 opacity-60" />
              <div>
                <p className="text-xs font-mono text-[#888]">The Monarch Report</p>
                <p className="text-[10px] font-mono text-[#444]">{siteConfig.tagline}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-6 text-[11px] font-mono">
              <a href={siteConfig.x} target="_blank" rel="noopener noreferrer" className="text-[#666] hover:text-white transition-colors">𝕏 / Twitter</a>
              <a href={siteConfig.instagram} target="_blank" rel="noopener noreferrer" className="text-[#666] hover:text-white transition-colors">Instagram</a>
              <a href="/dashboard" className="text-[#666] hover:text-white transition-colors">Economic Dashboard</a>
              <a href="#newsletter" className="text-[#666] hover:text-white transition-colors">Newsletter</a>
            </div>
            <p className="text-[10px] font-mono text-[#333]">© 2026 The Monarch Report. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
