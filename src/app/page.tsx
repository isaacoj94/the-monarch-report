'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import MonarchNewsHero from '@/components/MonarchNewsHero';
import { siteConfig } from '@/lib/content';
import { currentSnapshot } from '@/lib/data';
import { koreaTimeline, politicalPrisoners, unLawViolations } from '@/lib/editorial';
import { articles, articleCategory, articleLang, articleSlug } from '@/lib/articles';
import { captureUtms, trackEvent, type UtmPayload } from '@/lib/utm-client';
import styles from './home.module.css';

type BriefImpact = { people: string; companies: string };

const impactByCategory: Record<string, BriefImpact> = {
  legislation: {
    people: 'Changes to law can alter speech, court access and the protections available to ordinary citizens.',
    companies: 'New enforcement powers can change compliance exposure, litigation risk and investor confidence.',
  },
  'religious-freedom': {
    people: 'The precedent affects how freely communities can organize, worship and participate in public life.',
    companies: 'Institutional targeting can signal wider rule-of-law and reputation risks for organizations operating in Korea.',
  },
  'court-case': {
    people: 'The ruling tests due process and the balance between state power and individual liberty.',
    companies: 'Court independence and predictable enforcement are core conditions for long-term investment.',
  },
  corporate: {
    people: 'Regulatory actions can affect jobs, services, privacy and household costs.',
    companies: 'The case may influence foreign investment, governance expectations and operational risk.',
  },
  'foreign-policy': {
    people: 'Security and alliance choices shape daily safety, public trust and Korea’s place in the region.',
    companies: 'Geopolitical shifts affect trade, sanctions, supply chains and market access.',
  },
};

const sourceType = (source: string) => {
  if (/wikipedia/i.test(source)) return 'Reference source';
  if (/court|assembly|ministry|un\b/i.test(source)) return 'Primary record';
  return 'Published reporting';
};

export default function Home() {
  const [ledgerOpen, setLedgerOpen] = useState(false);
  const [impactView, setImpactView] = useState<'people' | 'companies'>('people');
  const [email, setEmail] = useState('');
  const [emailStatus, setEmailStatus] = useState<'idle' | 'loading' | 'sent' | 'error'>('idle');
  const utms = useRef<UtmPayload>({});

  useEffect(() => { utms.current = captureUtms(); }, []);

  const latestBriefs = useMemo(() => koreaTimeline.slice(-6).reverse().slice(0, 4), []);
  const latestArticles = useMemo(() => articles.filter((article) => articleLang(article) === 'en').slice(0, 6), []);

  const submitNewsletter = async (event: React.FormEvent) => {
    event.preventDefault();
    setEmailStatus('loading');
    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, ...utms.current }),
      });
      if (!response.ok) throw new Error('Signup failed');
      setEmailStatus('sent');
      trackEvent('newsletter_signup', { method: 'news-desk', ...utms.current });
    } catch {
      setEmailStatus('error');
    }
  };

  return (
    <main className={styles.page}>
      <header className={styles.masthead}>
        <div className={styles.utility}>
          <span>SEOUL / 서울 · ENGLISH EDITION</span>
          <span>USD/KRW ₩{currentSnapshot.usdKrw?.toLocaleString() ?? '—'} · KOSPI {currentSnapshot.kospi?.toLocaleString() ?? '—'}</span>
        </div>
        <div className={styles.navigation}>
          <Link href="/" className={styles.brand} aria-label="The Monarch Report home">
            <Image src="/logos/combined-gold.png" alt="The Monarch Report" width={554} height={80} priority />
          </Link>
          <nav aria-label="Primary navigation">
            <a href="#now">Now</a>
            <a href="#record">The Record</a>
            <Link href="/articles">Articles</Link>
            <Link href="/dashboard">Data</Link>
            <Link href="/documentary">Monarch Films</Link>
          </nav>
          <a className={styles.subscribeTop} href="#newsletter">Brief me</a>
        </div>
      </header>

      <MonarchNewsHero />

      <section id="now" className={styles.newsDesk}>
        <div className={styles.sectionHeading}>
          <div>
            <span className={styles.kicker}>Live editorial desk</span>
            <h2>What’s happening now</h2>
            <p>Important developments, translated into consequence—not copied from a social feed.</p>
          </div>
          <div className={styles.impactSwitch} role="group" aria-label="Choose impact perspective">
            <button aria-pressed={impactView === 'people'} onClick={() => setImpactView('people')}>For people</button>
            <button aria-pressed={impactView === 'companies'} onClick={() => setImpactView('companies')}>For companies</button>
          </div>
        </div>

        <div className={styles.briefGrid}>
          {latestBriefs.map((brief, index) => {
            const impact = impactByCategory[brief.category] ?? impactByCategory.legislation;
            return (
              <article className={index === 0 ? styles.leadBrief : styles.brief} key={`${brief.date}-${brief.title}`}>
                <div className={styles.briefMeta}>
                  <span>{brief.category.replace('-', ' ')}</span>
                  <time>{brief.date}</time>
                </div>
                <h3>{brief.title}</h3>
                <p>{brief.description}</p>
                <div className={styles.impactBox}>
                  <strong>{impactView === 'people' ? 'Why it matters to people' : 'Why it matters to companies'}</strong>
                  <span>{impact[impactView]}</span>
                </div>
                <a href={brief.sourceUrl} target="_blank" rel="noopener noreferrer" className={styles.sourceLink}>
                  {sourceType(brief.source)} · {brief.source} ↗
                </a>
              </article>
            );
          })}
        </div>
      </section>

      <section id="record" className={styles.recordSection}>
        <div className={styles.recordIntro}>
          <span className={styles.kicker}>Evidence dossier · MR-018</span>
          <h2>Freedom on record.</h2>
          <p>The claims, legal standards and reporting trail behind our coverage—kept visible so readers can inspect the case for themselves.</p>
          <button type="button" onClick={() => setLedgerOpen((open) => !open)} aria-expanded={ledgerOpen}>
            {ledgerOpen ? 'Close evidence ledger' : 'Open evidence ledger'} <span>→</span>
          </button>
        </div>
        <div className={styles.recordStats}>
          <div><small>STATUS</small><strong>Ongoing investigation</strong></div>
          <div><small>ON THE RECORD</small><strong>{politicalPrisoners.length} documented cases</strong></div>
          <div><small>LEGAL FRAMEWORK</small><strong>{unLawViolations.length} ICCPR protections</strong></div>
          <div><small>LANGUAGES</small><strong>Korean · Japanese · English</strong></div>
        </div>
        {ledgerOpen && (
          <div className={styles.ledger}>
            {unLawViolations.map((item) => (
              <article key={item.article}>
                <span>{item.article}</span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className={styles.articleSection}>
        <div className={styles.sectionHeading}>
          <div>
            <span className={styles.kicker}>Original reporting</span>
            <h2>Monarch Articles</h2>
            <p>Long-form reporting from our writers, preserved beyond the lifespan of a social post.</p>
          </div>
          <Link href="/articles" className={styles.allLink}>Explore the archive →</Link>
        </div>
        <div className={styles.articleGrid}>
          {latestArticles.map((article, index) => {
            const category = articleCategory(article);
            return (
              <Link className={index === 0 ? styles.featuredArticle : styles.articleCard} href={`/articles/${articleSlug(article)}`} key={article.id}>
                {article.coverImage && <img src={article.coverImage} alt="" />}
                <div>
                  <span>{category} · {new Date(article.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                  <h3>{article.title}</h3>
                  <p>{article.previewText}</p>
                  <strong>Read the article →</strong>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className={styles.filmBridge}>
        <div>
          <span className={styles.kicker}>A Monarch Films production</span>
          <h2>When reporting reaches the edge of the frame.</h2>
          <p>Enter the cinematic investigation behind <em>You’re Next: Do Nothing</em>.</p>
        </div>
        <Link href="/documentary">Enter Monarch Films <span>↗</span></Link>
      </section>

      <section id="newsletter" className={styles.newsletter}>
        <span className={styles.kicker}>The English briefing</span>
        <h2>Korea, with the missing context restored.</h2>
        <p>A concise dispatch for readers, policymakers and organizations that need more than the headline.</p>
        {emailStatus === 'sent' ? (
          <div className={styles.confirmation}>You’re on the briefing list. Thank you.</div>
        ) : (
          <form onSubmit={submitNewsletter}>
            <label className="sr-only" htmlFor="news-email">Email address</label>
            <input id="news-email" type="email" required placeholder="your@email.com" value={email} onChange={(event) => setEmail(event.target.value)} />
            <button disabled={emailStatus === 'loading'}>{emailStatus === 'loading' ? 'Joining…' : 'Join the briefing'}</button>
          </form>
        )}
        {emailStatus === 'error' && <p className={styles.formError}>We couldn’t complete the signup. Please try again.</p>}
      </section>

      <footer className={styles.footer}>
        <Image src="/logos/combined-gold.png" alt="The Monarch Report" width={554} height={80} />
        <p>Independent reporting on Korea, democracy and freedom of belief across Asia.</p>
        <div><a href={siteConfig.x}>𝕏</a><Link href="/articles">Articles</Link><Link href="/documentary">Films</Link></div>
      </footer>
    </main>
  );
}
