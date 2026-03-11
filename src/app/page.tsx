'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { siteConfig, newsletter, xHandle, instagramHandle } from '@/lib/content';
import { walletMetrics, macroMetrics } from '@/lib/data';
import {
  politicalPrisoners,
  unLawViolations,
  japanDissolution,
  dangerousBills,
  threatColors,
  statusLabels,
} from '@/lib/editorial';
import { articles as storedArticles, articleSlug, articleCategory, articleLang } from '@/lib/articles';
import ThemeToggle from '@/components/ThemeToggle';

// === TYPES ===

interface ExchangeData { rate: number }

interface TweetData {
  id: string;
  url: string;
  text: string;
  createdAt: string;
  likeCount: number;
  retweetCount: number;
  replyCount: number;
  viewCount: number;
  bookmarkCount: number;
  media: string[];
  isArticle: boolean;
  articleId: string | null;
  articleUrl: string | null;
  authorName: string;
  authorHandle: string;
  authorAvatar: string;
  authorVerified: boolean;
  links: { display: string; url: string }[];
}

interface KospiData {
  current: number;
  previousClose: number;
  change: number;
  changePercent: number;
}

// === HELPERS ===

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d`;
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function formatCount(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toString();
}

// === COMPONENTS ===

function SectionHeader({ color, title, subtitle }: { color: string; title: string; subtitle: string }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="w-1 h-6 rounded-full" style={{ backgroundColor: color }} />
      <div>
        <h2 className="text-2xl font-serif font-bold text-tm-heading">{title}</h2>
        <p className="text-tm-muted text-xs">{subtitle}</p>
      </div>
    </div>
  );
}

function HeroTweetCard({ tweet }: { tweet: TweetData }) {
  const displayText = tweet.text.replace(/https?:\/\/t\.co\/\w+/g, '').trim();
  const shownText = displayText.length > 400 ? displayText.slice(0, 400) + '...' : displayText;
  const hasImage = tweet.media.length > 0;

  return (
    <a href={tweet.url} target="_blank" rel="noopener noreferrer" className="block group">
      <div className="bg-tm-card border border-tm-border rounded-lg overflow-hidden hover:border-tm-border-hover transition-colors">
        {hasImage && (
          <img src={tweet.media[0]} alt="" className="w-full h-56 object-cover border-b border-tm-border" />
        )}
        <div className="p-4">
          <div className="flex items-center gap-2 mb-2">
            {tweet.authorAvatar && <img src={tweet.authorAvatar} alt="" className="w-5 h-5 rounded-full" />}
            <span className="text-xs font-mono text-tm-heading font-bold">@{tweet.authorHandle}</span>
            <span className="text-tm-dim text-[10px] font-mono ml-auto">{timeAgo(tweet.createdAt)}</span>
          </div>
          <p className="text-tm-body text-sm leading-relaxed whitespace-pre-line mb-3">{shownText}</p>
          <div className="flex items-center gap-4 text-tm-faint text-[11px] font-mono">
            <span>♥ {formatCount(tweet.likeCount)}</span>
            <span>⟳ {formatCount(tweet.retweetCount)}</span>
            <span>↩ {formatCount(tweet.replyCount)}</span>
            <span className="ml-auto">👁 {formatCount(tweet.viewCount)}</span>
          </div>
        </div>
      </div>
    </a>
  );
}

function TweetCard({ tweet }: { tweet: TweetData }) {
  const displayText = tweet.text.replace(/https?:\/\/t\.co\/\w+/g, '').trim();
  const hasImage = tweet.media.length > 0;
  const shownText = displayText.length > (hasImage ? 160 : 220) ? displayText.slice(0, hasImage ? 160 : 220) + '...' : displayText;

  return (
    <a href={tweet.url} target="_blank" rel="noopener noreferrer" className="block group">
      <div className="bg-tm-card border border-tm-border rounded-lg p-3 hover:border-tm-border-hover transition-colors h-full">
        <div className="flex items-center gap-2 mb-1.5">
          {tweet.authorAvatar && <img src={tweet.authorAvatar} alt="" className="w-4 h-4 rounded-full" />}
          <span className="text-[11px] font-mono text-tm-heading font-bold">@{tweet.authorHandle}</span>
          <span className="text-tm-dim text-[10px] font-mono ml-auto">{timeAgo(tweet.createdAt)}</span>
        </div>
        <div className={hasImage ? 'flex gap-3' : ''}>
          <p className={`text-tm-body text-xs leading-relaxed whitespace-pre-line mb-2 ${hasImage ? 'flex-1' : ''}`}>{shownText}</p>
          {hasImage && (
            <img src={tweet.media[0]} alt="" className="w-20 h-20 rounded-md object-cover border border-tm-border flex-shrink-0" />
          )}
        </div>
        <div className="flex items-center gap-3 text-tm-faint text-[10px] font-mono">
          <span>♥ {formatCount(tweet.likeCount)}</span>
          <span>⟳ {formatCount(tweet.retweetCount)}</span>
          <span className="ml-auto">👁 {formatCount(tweet.viewCount)}</span>
        </div>
      </div>
    </a>
  );
}

const articleCategoryColors: Record<string, { color: string; label: string }> = {
  korea: { color: '#ef4444', label: 'KOREA' },
  japan: { color: '#f59e0b', label: 'JAPAN' },
  democracy: { color: '#3b82f6', label: 'DEMOCRACY' },
  economy: { color: '#06b6d4', label: 'ECONOMY' },
  religion: { color: '#a855f7', label: 'RELIGION' },
};

// English articles only on homepage
const homeArticles = storedArticles.filter(a => articleLang(a) === 'en').slice(0, 6);

// === MAIN PAGE ===

export default function Home() {
  const [liveRate, setLiveRate] = useState<number | null>(null);
  const [kospi, setKospi] = useState<KospiData | null>(null);
  const [email, setEmail] = useState('');
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [tweets, setTweets] = useState<TweetData[]>([]);
  const [tweetsLoading, setTweetsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/exchange-rate').then(r => r.json()).then((d: ExchangeData) => setLiveRate(d.rate)).catch(() => {});
    fetch('/api/kospi').then(r => r.json()).then((d: KospiData) => setKospi(d)).catch(() => {});
    fetch('/api/tweets')
      .then(r => r.json())
      .then((data: { tweets: TweetData[] }) => {
        setTweets(data.tweets || []);
      })
      .catch(() => {})
      .finally(() => setTweetsLoading(false));
  }, []);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailLoading(true);
    setEmailError('');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to subscribe');
      }
      setEmailSubmitted(true);
    } catch (err) {
      setEmailError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setEmailLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-tm-page">
      {/* === HEADER === */}
      <header className="sticky top-0 z-50 bg-tm-page/95 backdrop-blur-sm border-b border-tm-border-subtle">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between py-1.5 border-b border-tm-border-subtle text-[10px] font-mono text-tm-muted">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="relative flex h-1.5 w-1.5"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" /><span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500" /></span>
                USD/KRW {liveRate ? `₩${liveRate.toLocaleString(undefined, { maximumFractionDigits: 0 })}` : '---'}
              </span>
              <span>KOSPI {kospi ? kospi.current.toLocaleString() : '---'}{kospi && <span className={kospi.change >= 0 ? 'text-green-500' : 'text-red-500'}> {kospi.change >= 0 ? '+' : ''}{kospi.changePercent}%</span>}</span>
              <span>Gas ₩{walletMetrics.gasPrice.currentValue.toLocaleString()}/L</span>
              <span>CPI {macroMetrics.inflation.currentValue}%</span>
            </div>
            <a href="/dashboard" className="text-tm-secondary hover:text-tm-heading transition-colors">Economic Dashboard →</a>
          </div>
          <div className="flex items-center justify-between py-3">
            <a href="/" className="flex items-center">
              <Image src="/logos/combined-gold.png" alt="The Monarch Report" width={554} height={80} className="h-8 w-auto" priority />
            </a>
            <nav className="hidden md:flex items-center gap-1 text-xs font-mono">
              <a href="#faith" className="px-3 py-1.5 text-tm-secondary hover:text-tm-heading transition-colors">Faith on Fire</a>
              <a href="#japan" className="px-3 py-1.5 text-tm-secondary hover:text-tm-heading transition-colors">Japan</a>
              <a href="#democracy" className="px-3 py-1.5 text-tm-secondary hover:text-tm-heading transition-colors">Democracy</a>
              <a href="#economy" className="px-3 py-1.5 text-tm-secondary hover:text-tm-heading transition-colors">Economy</a>
              <a href="#latest" className="px-3 py-1.5 text-tm-secondary hover:text-tm-heading transition-colors">Latest</a>
              <Link href="/articles" className="px-3 py-1.5 text-tm-secondary hover:text-tm-heading transition-colors">Articles</Link>
              <a href="/dashboard" className="px-3 py-1.5 text-tm-secondary hover:text-tm-heading transition-colors">Dashboard</a>
              <a href="#newsletter" className="px-3 py-1.5 bg-tm-gold hover:bg-tm-gold-hover text-tm-page font-bold rounded transition-colors ml-2">Subscribe</a>
              <ThemeToggle />
            </nav>
          </div>
        </div>
      </header>

      {/* ============================================ */}
      {/* === HERO: FAITH ON FIRE ==================== */}
      {/* ============================================ */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--tm-hero-from)] via-[var(--tm-hero-via)] to-tm-page" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--tm-hero-glow),transparent_70%)]" />
        <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-24">
          <div className="max-w-4xl">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-[10px] font-mono font-bold tracking-widest text-tm-gold bg-[var(--tm-gold-bg)] px-3 py-1 rounded-full border border-[var(--tm-gold-border)]">
                RELIGIOUS FREEDOM CRISIS
              </span>
              <span className="text-[10px] text-tm-faint">South Korea & Japan · 2025-2026</span>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold leading-[1.05] mb-5 text-tm-heading">
              Faith on Fire
            </h1>
            <p className="text-lg md:text-xl text-tm-body leading-relaxed mb-3 max-w-3xl">
              Pastors jailed for preaching. An 83-year-old religious leader detained without conviction.
              A church dissolved for the first time in a democracy without criminal charges.
            </p>
            <p className="text-sm text-tm-muted leading-relaxed max-w-2xl mb-8">
              The Lee Jae-myung government in South Korea and the Japanese courts are waging
              an unprecedented campaign against religious freedom — in violation of
              international law. These are the facts.
            </p>
            <div className="flex flex-wrap gap-3">
              <a href="#faith" className="inline-flex items-center gap-2 px-6 py-3 bg-tm-gold hover:bg-tm-gold-hover text-tm-page font-bold text-sm rounded transition-colors">
                See the Evidence →
              </a>
              <a href={siteConfig.x} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 border border-tm-border-hover hover:border-tm-border-active text-tm-heading text-sm rounded transition-colors">
                Follow on 𝕏
              </a>
            </div>
          </div>

          {/* Hero stats strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-12">
            {[
              { label: 'Religious Leaders Targeted', value: String(politicalPrisoners.length) + '+', color: '#d4a017' },
              { label: 'Days Dr. Han Detained', value: '170+', color: '#c084fc' },
              { label: 'Democracy-Eroding Bills', value: String(dangerousBills.length), color: '#e8b82a' },
              { label: 'UN Laws Violated', value: String(unLawViolations.length), color: '#93c5fd' },
            ].map(stat => (
              <div key={stat.label} className="bg-tm-card/60 border border-tm-border rounded-lg p-4 text-center backdrop-blur-sm">
                <p className="text-3xl font-serif font-bold" style={{ color: stat.color }}>{stat.value}</p>
                <p className="text-[10px] text-tm-muted mt-1 tracking-wide uppercase">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission bar */}
      <section className="border-y border-tm-border-subtle bg-tm-section">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-1 h-8 bg-tm-gold rounded-full" />
              <div>
                <p className="text-tm-heading text-sm font-bold">{siteConfig.tagline}</p>
                <p className="text-tm-muted text-[11px]">Independent journalism · Trusted by U.S. legislators · Fact-based</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono">
              <a href={siteConfig.x} target="_blank" rel="noopener noreferrer" className="text-tm-secondary hover:text-tm-heading transition-colors px-2.5 py-1 border border-tm-border rounded hover:border-tm-border-active">𝕏 Follow</a>
              <a href={siteConfig.instagram} target="_blank" rel="noopener noreferrer" className="text-tm-secondary hover:text-tm-heading transition-colors px-2.5 py-1 border border-tm-border rounded hover:border-tm-border-active">IG Follow</a>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* === KOREA: RELIGIOUS FREEDOM UNDER SIEGE === */}
      {/* ============================================ */}
      <section id="faith" className="max-w-7xl mx-auto px-4 py-12">
        <SectionHeader color="#ef4444" title="Korea: Religious Freedom Under Siege" subtitle="Pastors jailed, churches raided, leaders detained without conviction" />

        {/* Prisoner cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {politicalPrisoners.map(p => (
            <div key={p.name} className="bg-tm-card border border-tm-border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="text-tm-heading font-serif font-bold text-sm">{p.name} <span className="text-tm-muted font-normal">({p.nameKo})</span></h3>
                  <p className="text-tm-secondary text-[11px] font-mono">{p.title}</p>
                </div>
                <span className={`text-[9px] font-mono font-bold tracking-wider px-2 py-0.5 rounded-full border ${
                  p.status === 'detained' ? 'text-red-400 bg-red-400/10 border-red-400/20' :
                  p.status === 'released' ? 'text-green-400 bg-green-400/10 border-green-400/20' :
                  p.status === 'raided' ? 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20' :
                  'text-blue-400 bg-blue-400/10 border-blue-400/20'
                }`}>
                  {p.status.toUpperCase()}
                </span>
              </div>
              <p className="text-tm-muted text-[11px] mb-2"><strong className="text-tm-secondary">Charges:</strong> {p.charges}</p>
              <p className="text-tm-secondary text-xs leading-relaxed">{p.details}</p>
              {p.daysDetained && (
                <p className="text-red-400 text-[11px] font-mono mt-2 font-bold">{p.daysDetained} days detained</p>
              )}
            </div>
          ))}
        </div>

        {/* UN Law Violations */}
        <div className="bg-tm-card border border-tm-border rounded-lg p-5 mb-4">
          <h3 className="text-blue-400 text-xs font-mono font-bold uppercase tracking-wider mb-3">
            International Law Violations — ICCPR (Ratified by South Korea)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {unLawViolations.map(v => (
              <div key={v.article} className="flex gap-3">
                <span className="text-blue-400 text-xs font-mono font-bold whitespace-nowrap mt-0.5">{v.article}</span>
                <div>
                  <p className="text-tm-heading text-xs font-bold">{v.title}</p>
                  <p className="text-tm-secondary text-[11px] leading-relaxed">{v.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* === JAPAN: THE DISSOLUTION PRECEDENT ======= */}
      {/* ============================================ */}
      <section id="japan" className="max-w-7xl mx-auto px-4 py-12 border-t border-tm-border-subtle">
        <SectionHeader color="#f59e0b" title="Japan: The Dissolution Precedent" subtitle="First religious organization dissolved without criminal charges in a modern democracy" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Timeline */}
          <div className="bg-tm-card border border-tm-border rounded-lg p-4">
            <h3 className="text-xs font-mono text-tm-secondary uppercase tracking-wider mb-3">Timeline</h3>
            <div className="space-y-3">
              {japanDissolution.timeline.map((t, i) => (
                <div key={i} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-2 h-2 rounded-full ${i === japanDissolution.timeline.length - 1 ? 'bg-yellow-400 animate-pulse' : 'bg-tm-border-active'}`} />
                    {i < japanDissolution.timeline.length - 1 && <div className="w-px h-full bg-tm-border mt-1" />}
                  </div>
                  <div className="pb-2">
                    <p className="text-[10px] font-mono text-tm-muted">{t.date}</p>
                    <p className="text-tm-body text-xs leading-relaxed">{t.event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Communist Connection */}
          <div className="bg-tm-card border border-tm-border rounded-lg p-4">
            <h3 className="text-xs font-mono text-tm-secondary uppercase tracking-wider mb-3">Communist Party Connection</h3>
            <p className="text-tm-secondary text-xs leading-relaxed mb-3">
              The lawyers behind the dissolution campaign were primarily affiliated with the <strong className="text-tm-heading">Japanese Communist Party</strong> and Socialist Party.
            </p>
            <div className="bg-tm-input border border-tm-border-subtle rounded p-3 mb-3">
              <p className="text-tm-body text-xs italic leading-relaxed">&ldquo;{japanDissolution.communistConnection.jcpQuote.text}&rdquo;</p>
              <p className="text-tm-muted text-[10px] font-mono mt-1">— {japanDissolution.communistConnection.jcpQuote.speaker}</p>
            </div>
            <div className="space-y-1.5 text-[11px] text-tm-secondary">
              <p><strong className="text-tm-secondary">Network:</strong> {japanDissolution.communistConnection.organization}</p>
              <p><strong className="text-tm-secondary">Members:</strong> {japanDissolution.communistConnection.members}</p>
              <p><strong className="text-tm-secondary">Founded:</strong> {japanDissolution.communistConnection.founded}</p>
            </div>
          </div>

          {/* Why They Were Targeted */}
          <div className="bg-tm-card border border-tm-border rounded-lg p-4">
            <h3 className="text-xs font-mono text-tm-secondary uppercase tracking-wider mb-3">Why the Church Was Targeted</h3>
            <ul className="space-y-2">
              {japanDissolution.antiCommunistHistory.map((fact, i) => (
                <li key={i} className="flex items-start gap-2 text-tm-secondary text-xs leading-relaxed">
                  <span className="text-[#f59e0b] mt-0.5">◆</span>
                  <span>{fact}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 pt-3 border-t border-tm-border-subtle">
              <h4 className="text-[10px] font-mono text-tm-muted uppercase tracking-wider mb-2">International Response</h4>
              {japanDissolution.internationalReactions.map((r, i) => (
                <div key={i} className="mb-2">
                  <p className="text-tm-body text-[11px] italic">&ldquo;{r.quote}&rdquo;</p>
                  <p className="text-tm-faint text-[10px] font-mono">— {r.who}, {r.date}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* === DEMOCRACY IN DECLINE =================== */}
      {/* ============================================ */}
      <section id="democracy" className="max-w-7xl mx-auto px-4 py-12 border-t border-tm-border-subtle">
        <SectionHeader color="#3b82f6" title="Democracy in Decline" subtitle="Bills and actions eroding judicial independence, free speech, and religious freedom" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {dangerousBills.map(bill => {
            const threat = threatColors[bill.threat];
            const status = statusLabels[bill.status];
            return (
              <div key={bill.name} className="bg-tm-card border border-tm-border rounded-lg p-3 hover:border-tm-border-hover transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[8px] font-mono font-bold tracking-wider px-1.5 py-0.5 rounded border" style={{ color: threat.color, backgroundColor: threat.color + '15', borderColor: threat.color + '30' }}>
                    {threat.label.toUpperCase()}
                  </span>
                  <span className="text-[8px] font-mono font-bold tracking-wider" style={{ color: status.color }}>
                    {status.label}
                  </span>
                </div>
                <h3 className="text-tm-heading text-sm font-serif font-bold mb-1">{bill.name}</h3>
                <p className="text-tm-secondary text-[11px] leading-relaxed mb-2">{bill.summary}</p>
                <p className="text-tm-faint text-[10px] font-mono">{bill.date}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ============================================ */}
      {/* === ECONOMIC REALITY ======================= */}
      {/* ============================================ */}
      <section id="economy" className="border-y border-tm-border-subtle bg-tm-section">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-1 h-6 bg-[#06b6d4] rounded-full" />
              <div>
                <h2 className="text-xl font-serif font-bold text-tm-heading">The Economic Cost</h2>
                <p className="text-tm-muted text-xs font-mono">When democracy erodes, the economy follows</p>
              </div>
            </div>
            <a href="/dashboard" className="text-xs font-mono text-tm-gold hover:text-tm-gold-hover transition-colors border border-tm-border hover:border-tm-gold/25 rounded px-3 py-1.5">
              Full Dashboard →
            </a>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { label: 'USD/KRW', value: liveRate ? `₩${liveRate.toLocaleString(undefined, { maximumFractionDigits: 0 })}` : `₩${macroMetrics.usdKrw.currentValue}`, change: `+${macroMetrics.usdKrw.changePercent}%`, color: '#3b82f6', bad: true },
              { label: 'KOSPI', value: kospi ? kospi.current.toLocaleString() : '---', change: kospi ? `${kospi.change >= 0 ? '+' : ''}${kospi.changePercent}%` : '', color: '#06b6d4', bad: kospi ? kospi.change < 0 : false },
              { label: 'Inflation', value: `${macroMetrics.inflation.currentValue}%`, change: `+${macroMetrics.inflation.changePercent}%`, color: '#eab308', bad: true },
              { label: 'Gas/Liter', value: `₩${walletMetrics.gasPrice.currentValue.toLocaleString()}`, change: `+${walletMetrics.gasPrice.changePercent}%`, color: '#ef4444', bad: true },
              { label: 'Household Debt/GDP', value: `${macroMetrics.householdDebt.currentValue}%`, change: `+${macroMetrics.householdDebt.changePercent}%`, color: '#ef4444', bad: true },
              { label: 'Youth Unemployment', value: `${macroMetrics.youthUnemployment.currentValue}%`, change: `+${macroMetrics.youthUnemployment.changePercent}%`, color: '#a855f7', bad: true },
            ].map(item => (
              <div key={item.label} className="bg-tm-card border border-tm-border rounded-lg p-3 text-center">
                <p className="text-[10px] font-mono text-tm-muted mb-1">{item.label}</p>
                <p className="text-lg font-bold font-mono" style={{ color: item.color }}>{item.value}</p>
                {item.change && (
                  <p className={`text-[10px] font-mono mt-0.5 ${item.bad ? 'text-red-400' : 'text-green-400'}`}>
                    {item.change} since inauguration
                  </p>
                )}
              </div>
            ))}
          </div>

          <p className="text-tm-faint text-[11px] text-center mt-4">
            Korean media focuses on approval ratings. These numbers tell the real story. <a href="/dashboard" className="text-tm-gold hover:text-tm-gold-hover">See all metrics →</a>
          </p>
        </div>
      </section>

      {/* ============================================ */}
      {/* === LATEST FROM X + ARTICLES =============== */}
      {/* ============================================ */}
      <section id="latest" className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <SectionHeader color="#b8860b" title="Latest from The Monarch Report" subtitle={`@${xHandle} on 𝕏`} />
          <a href={siteConfig.x} target="_blank" rel="noopener noreferrer" className="text-xs font-mono text-tm-secondary hover:text-tm-heading transition-colors">
            View all →
          </a>
        </div>

        {/* Featured Articles — static from stored data */}
        {homeArticles.length > 0 && (
          <div className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-mono text-tm-secondary uppercase tracking-wider">Featured Articles</h3>
              <Link href="/articles" className="text-xs font-mono text-tm-gold hover:text-tm-gold-hover transition-colors">
                All Articles →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {homeArticles.map(a => {
                const cat = articleCategory(a);
                const catInfo = articleCategoryColors[cat] || articleCategoryColors.korea;
                const dateStr = new Date(a.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                return (
                  <Link key={a.id} href={`/articles/${articleSlug(a)}`} className="block group">
                    <div className="bg-tm-card border border-tm-border rounded-lg overflow-hidden hover:border-tm-border-active transition-all h-full flex flex-col">
                      <div className="h-0.5" style={{ backgroundColor: catInfo.color }} />
                      {a.coverImage && (
                        <img src={a.coverImage} alt={a.title} className="w-full h-36 object-cover" />
                      )}
                      <div className="p-4 flex-1 flex flex-col">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-[8px] font-mono font-bold tracking-widest px-1.5 py-0.5 rounded" style={{ color: catInfo.color, backgroundColor: catInfo.color + '15', border: `1px solid ${catInfo.color}30` }}>
                            {catInfo.label}
                          </span>
                          <span className="text-tm-faint text-[10px] font-mono">{dateStr}</span>
                        </div>
                        <h3 className="text-tm-heading text-sm font-serif font-bold leading-snug group-hover:text-tm-gold transition-colors mb-2 flex-1">
                          {a.title}
                        </h3>
                        <p className="text-tm-secondary text-[11px] leading-relaxed mb-3 line-clamp-2">{a.previewText}</p>
                        <div className="flex items-center justify-between text-tm-faint text-[10px] font-mono pt-2 border-t border-tm-border-subtle">
                          <span>{a.likes.toLocaleString()} likes · {a.views.toLocaleString()} views</span>
                          <span className="text-tm-gold font-bold">Read →</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Tweets: hero + grid */}
        {tweetsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-tm-card border border-tm-border rounded-lg p-3 animate-pulse">
                <div className="h-3 bg-tm-border rounded w-1/3 mb-2" />
                <div className="h-2.5 bg-tm-border-subtle rounded w-full mb-1.5" />
                <div className="h-2.5 bg-tm-border-subtle rounded w-4/5 mb-1.5" />
                <div className="h-2.5 bg-tm-border-subtle rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : tweets.length > 0 ? (
          <>
            {/* Hero tweet — first post with full image */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-3">
              <div className="lg:col-span-2">
                <HeroTweetCard tweet={tweets[0]} />
              </div>
              <div className="space-y-3">
                {tweets.slice(1, 3).map(tweet => (
                  <TweetCard key={tweet.id} tweet={tweet} />
                ))}
              </div>
            </div>
            {/* Remaining tweets */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {tweets.slice(3, 9).map(tweet => (
                <TweetCard key={tweet.id} tweet={tweet} />
              ))}
            </div>
          </>
        ) : (
          <div className="bg-tm-card border border-tm-border rounded-lg p-6 text-center">
            <p className="text-tm-faint font-mono text-sm">Loading posts...</p>
            <a href={siteConfig.x} target="_blank" rel="noopener noreferrer" className="inline-block mt-2 text-xs font-mono text-tm-gold">View on 𝕏 →</a>
          </div>
        )}
      </section>

      {/* ============================================ */}
      {/* === NEWSLETTER ============================= */}
      {/* ============================================ */}
      <section id="newsletter" className="border-y border-tm-border-subtle bg-tm-section">
        <div className="max-w-3xl mx-auto px-4 py-14 text-center">
          <Image src="/logos/icon-gold.png" alt="" width={48} height={48} className="w-10 h-10 mx-auto mb-5 opacity-60" />
          <h2 className="text-2xl font-serif font-bold text-tm-heading mb-2">{newsletter.title}</h2>
          <p className="text-tm-secondary text-sm mb-5 max-w-md mx-auto">{newsletter.subtitle}</p>
          {emailSubmitted ? (
            <p className="text-tm-gold font-mono text-sm">Thank you for subscribing.</p>
          ) : (
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" required
                className="flex-1 bg-tm-input border border-tm-border-hover rounded-lg px-4 py-3 text-sm font-mono text-tm-heading placeholder:text-tm-faint focus:border-tm-gold focus:outline-none transition-colors" />
              <button type="submit" disabled={emailLoading}
                className="px-6 py-3 bg-tm-gold hover:bg-tm-gold-hover text-tm-page font-mono font-bold text-sm rounded-lg transition-colors disabled:opacity-50">
                {emailLoading ? '...' : 'Subscribe'}
              </button>
            </form>
          )}
          {emailError && <p className="text-red-400 text-xs font-mono mt-2">{emailError}</p>}
          <p className="text-tm-dim text-[10px] font-mono mt-3">{newsletter.disclaimer}</p>
        </div>
      </section>

      {/* === ABOUT === */}
      <section id="about" className="max-w-7xl mx-auto px-4 py-14">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-6 bg-tm-gold rounded-full" />
            <h2 className="text-xl font-serif font-bold text-tm-heading">About The Monarch Report</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8 text-sm text-tm-secondary leading-relaxed">
            <div>
              <h3 className="text-tm-heading font-serif font-bold mb-3">Our Mission</h3>
              <p className="mb-4">
                The Monarch Report exists to bring the truth about Korea and Japan to Western audiences — especially legislators, policymakers, and citizens who care about democracy, human rights, and religious freedom in East Asia.
              </p>
              <p>
                We are social-first journalists. Our reporting originates on X and Instagram, where we reach hundreds of thousands of people with fact-based analysis that mainstream media won&apos;t cover.
              </p>
            </div>
            <div>
              <h3 className="text-tm-heading font-serif font-bold mb-3">Our Values</h3>
              <ul className="space-y-2.5">
                {[
                  { label: 'Democracy', text: 'Transparent governance and the right to hold leaders accountable.' },
                  { label: 'Freedom of Speech', text: 'The truth must never be silenced.' },
                  { label: 'Freedom of Religion', text: 'Religious persecution is an assault on human dignity.' },
                  { label: 'Facts First', text: 'Every claim backed by evidence. We show our sources.' },
                ].map(v => (
                  <li key={v.label} className="flex items-start gap-2">
                    <span className="text-tm-gold mt-0.5">◆</span>
                    <span><strong className="text-tm-heading">{v.label}</strong> — {v.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* === FOOTER === */}
      <footer className="border-t border-tm-border-subtle bg-tm-footer">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-start justify-between gap-6">
            <div className="flex items-center gap-3">
              <Image src="/logos/icon-gold.png" alt="" width={28} height={28} className="w-7 h-7 opacity-60" />
              <div>
                <p className="text-xs font-mono text-tm-secondary">The Monarch Report</p>
                <p className="text-[10px] font-mono text-tm-dim">{siteConfig.tagline}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-6 text-[11px] font-mono">
              <a href={siteConfig.x} target="_blank" rel="noopener noreferrer" className="text-tm-muted hover:text-tm-heading transition-colors">𝕏 / Twitter</a>
              <a href={siteConfig.instagram} target="_blank" rel="noopener noreferrer" className="text-tm-muted hover:text-tm-heading transition-colors">Instagram</a>
              <a href="/dashboard" className="text-tm-muted hover:text-tm-heading transition-colors">Economic Dashboard</a>
              <a href="#newsletter" className="text-tm-muted hover:text-tm-heading transition-colors">Newsletter</a>
            </div>
            <p className="text-[10px] font-mono text-tm-ghost">© 2026 The Monarch Report. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
