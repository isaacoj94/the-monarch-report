'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import MonarchNewsHero from '@/components/MonarchNewsHero';
import { siteConfig } from '@/lib/content';
import { currentSnapshot } from '@/lib/data';
import { koreaTimeline, KOREA_TIMELINE_RANGE_LABEL } from '@/lib/editorial';
import { articles, articleCategory, articleLang, articleSlug } from '@/lib/articles';
import { captureUtms, trackEvent, type UtmPayload } from '@/lib/utm-client';
import { useLocale } from '@/components/LocaleProvider';
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

const homeCopy = {
  en: {
    edition: 'SEOUL / 서울 · ENGLISH EDITION', now: 'Now', articles: 'Articles', data: 'Data', films: 'Monarch Films', subscribe: 'Subscribe free',
    desk: 'The editorial briefing', happening: 'What’s happening now', happeningDek: 'Important developments, translated into consequence—not copied from a social feed.', verified: 'Briefing desk verified',
    people: 'For people', companies: 'For companies', mattersPeople: 'Why it matters to people', mattersCompanies: 'Why it matters to companies',
    closeProgression: 'Close case progression', viewProgression: 'View case progression',
    original: 'Original reporting', monarchArticles: 'Monarch Articles', articleDek: 'Long-form reporting from our writers, preserved beyond the lifespan of a social post.', archive: 'Explore the archive →', read: 'Read the article →',
    fromFilms: 'From Monarch Films', filmTitle: 'Stories that demand more than a headline.', filmDek: 'Discover current and upcoming documentary work, beginning with You’re Next: Do Nothing.', enterFilms: 'Enter Monarch Films',
    newsletter: 'Email newsletter', newsletterTitle: 'Korea, with the missing context restored.', newsletterDek: 'A concise dispatch for readers, policymakers and organizations that need more than the headline.', thanks: 'You’re subscribed. Thank you.', subscribing: 'Subscribing…', subscribeButton: 'Subscribe free', email: 'Email address', error: 'We couldn’t complete the signup. Please try again.',
  },
  ko: {
    edition: '서울 · 한국어 안내', now: '지금', articles: '기사', data: '데이터', films: '모나크 필름', subscribe: '무료 구독',
    desk: '편집 브리핑', happening: '지금 무슨 일이 일어나고 있나', happeningDek: '소셜 피드를 옮겨 적는 대신, 중요한 사안이 실제로 어떤 영향을 주는지 설명합니다.', verified: '브리핑 데스크 확인일',
    people: '개인·가족', companies: '기업', mattersPeople: '개인과 가족에게 중요한 이유', mattersCompanies: '기업에 중요한 이유',
    closeProgression: '진행 경과 닫기', viewProgression: '진행 경과 보기',
    original: '자체 취재·기고', monarchArticles: '모나크 아티클', articleDek: '소셜 게시물의 수명을 넘어 보존하는 필진의 심층 기사입니다.', archive: '전체 기사 보기 →', read: '기사 읽기 →',
    fromFilms: '모나크 필름', filmTitle: '헤드라인만으로는 부족한 이야기.', filmDek: '《You’re Next: Do Nothing》을 시작으로 현재와 향후 다큐멘터리 작업을 소개합니다.', enterFilms: '모나크 필름 보기',
    newsletter: '이메일 뉴스레터', newsletterTitle: '빠진 맥락까지 담은 한국 소식.', newsletterDek: '헤드라인 이상의 정보가 필요한 독자와 정책 관계자, 기업을 위한 간결한 소식입니다.', thanks: '구독이 완료되었습니다. 감사합니다.', subscribing: '구독 중…', subscribeButton: '무료 구독', email: '이메일 주소', error: '구독을 완료하지 못했습니다. 다시 시도해 주세요.',
  },
  ja: {
    edition: 'ソウル · 日本語案内', now: '最新', articles: '記事', data: 'データ', films: 'モナーク・フィルムズ', subscribe: '無料購読',
    desk: '編集ブリーフィング', happening: 'いま何が起きているのか', happeningDek: 'SNSの投稿を転載するのではなく、重要な動きが実生活に及ぼす影響を説明します。', verified: 'ブリーフィング確認日',
    people: '個人・家族', companies: '企業', mattersPeople: '個人と家族にとって重要な理由', mattersCompanies: '企業にとって重要な理由',
    closeProgression: '経緯を閉じる', viewProgression: '経緯を見る',
    original: '独自取材・寄稿', monarchArticles: 'モナーク・アーティクルズ', articleDek: 'SNS投稿の寿命を超えて残す、執筆陣による長編記事です。', archive: '全記事を見る →', read: '記事を読む →',
    fromFilms: 'モナーク・フィルムズ', filmTitle: '見出しだけでは伝わらない物語。', filmDek: '『You’re Next: Do Nothing』を皮切りに、現在および今後のドキュメンタリー作品を紹介します。', enterFilms: 'モナーク・フィルムズへ',
    newsletter: 'メールニュースレター', newsletterTitle: '欠けていた背景まで伝える韓国情報。', newsletterDek: '見出し以上の情報を必要とする読者、政策関係者、企業のための簡潔な配信です。', thanks: '購読登録が完了しました。', subscribing: '登録中…', subscribeButton: '無料購読', email: 'メールアドレス', error: '登録できませんでした。もう一度お試しください。',
  },
} as const;

export default function Home() {
  const { locale } = useLocale();
  const copy = homeCopy[locale];
  const [impactView, setImpactView] = useState<'people' | 'companies'>('people');
  const [openTimeline, setOpenTimeline] = useState<string | null>(null);
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
          <span>{copy.edition}</span>
          <span>USD/KRW ₩{currentSnapshot.usdKrw?.toLocaleString() ?? '—'} · KOSPI {currentSnapshot.kospi?.toLocaleString() ?? '—'}</span>
        </div>
        <div className={styles.navigation}>
          <Link href="/" className={styles.brand} aria-label="The Monarch Report home">
            <Image src="/logos/combined-gold.png" alt="The Monarch Report" width={554} height={80} priority />
          </Link>
          <nav aria-label="Primary navigation">
            <a href="#now">{copy.now}</a>
            <Link href="/articles">{copy.articles}</Link>
            <Link href="/dashboard">{copy.data}</Link>
            <Link href="/documentary">{copy.films}</Link>
          </nav>
          <a className={styles.subscribeTop} href="#newsletter">{copy.subscribe}</a>
        </div>
      </header>

      <MonarchNewsHero />

      <section id="now" className={styles.newsDesk}>
        <div className={styles.sectionHeading}>
          <div>
            <span className={styles.kicker}>{copy.desk}</span>
            <h2>{copy.happening}</h2>
            <p>{copy.happeningDek}</p>
            <small className={styles.freshnessNote}>{copy.verified} · {KOREA_TIMELINE_RANGE_LABEL}</small>
          </div>
          <div className={styles.impactSwitch} role="group" aria-label="Choose impact perspective">
            <button aria-pressed={impactView === 'people'} onClick={() => setImpactView('people')}>{copy.people}</button>
            <button aria-pressed={impactView === 'companies'} onClick={() => setImpactView('companies')}>{copy.companies}</button>
          </div>
        </div>

        <div className={styles.briefGrid}>
          {latestBriefs.map((brief, index) => {
            const impact = impactByCategory[brief.category] ?? impactByCategory.legislation;
            const briefTitle = locale === 'ko' ? brief.titleKo ?? brief.title : locale === 'ja' ? brief.titleJa ?? brief.title : brief.title;
            const briefDescription = locale === 'ko' ? brief.descriptionKo ?? brief.description : locale === 'ja' ? brief.descriptionJa ?? brief.description : brief.description;
            const localizedImpact = locale === 'ko'
              ? (impactView === 'people' ? '이 사안은 한국에서 생활하거나 가족을 둔 사람들의 권리, 비용, 공공기관 이용에 직접 영향을 줄 수 있습니다.' : '법 집행과 규제의 변화는 기업의 준법 부담, 투자 위험, 인력과 운영 계획에 영향을 줄 수 있습니다.')
              : locale === 'ja'
                ? (impactView === 'people' ? 'この問題は、韓国で暮らす人や家族を持つ人の権利、生活費、公的機関の利用に直接影響する可能性があります。' : '法執行や規制の変化は、企業のコンプライアンス負担、投資リスク、人員・事業計画に影響する可能性があります。')
                : impact[impactView];
            const briefKey = `${brief.date}-${brief.title}`;
            const briefIndex = koreaTimeline.findIndex((item) => item.date === brief.date && item.title === brief.title);
            const progression = koreaTimeline
              .slice(0, briefIndex + 1)
              .filter((item) => item.category === brief.category)
              .slice(-4);
            return (
              <article className={index === 0 ? styles.leadBrief : styles.brief} key={briefKey}>
                <div className={styles.briefMeta}>
                  <span>{brief.category.replace('-', ' ')}</span>
                  <time>{brief.date}</time>
                </div>
                <h3>{briefTitle}</h3>
                <p>{briefDescription}</p>
                <div className={styles.impactBox}>
                  <strong>{impactView === 'people' ? copy.mattersPeople : copy.mattersCompanies}</strong>
                  <span>{localizedImpact}</span>
                </div>
                {progression.length > 1 && (
                  <div className={styles.contextTimeline}>
                    <button type="button" onClick={() => setOpenTimeline(openTimeline === briefKey ? null : briefKey)} aria-expanded={openTimeline === briefKey}>
                      {openTimeline === briefKey ? copy.closeProgression : copy.viewProgression} <span>→</span>
                    </button>
                    {openTimeline === briefKey && (
                      <ol>
                        {progression.map((event) => (
                          <li key={`${event.date}-${event.title}`}>
                            <time>{event.date}</time>
                            <div><strong>{locale === 'ko' ? event.titleKo ?? event.title : locale === 'ja' ? event.titleJa ?? event.title : event.title}</strong><a href={event.sourceUrl} target="_blank" rel="noopener noreferrer">{event.source} ↗</a></div>
                          </li>
                        ))}
                      </ol>
                    )}
                  </div>
                )}
                <a href={brief.sourceUrl} target="_blank" rel="noopener noreferrer" className={styles.sourceLink}>
                  {sourceType(brief.source)} · {brief.source} ↗
                </a>
              </article>
            );
          })}
        </div>
      </section>

      <section className={styles.articleSection}>
        <div className={styles.sectionHeading}>
          <div>
            <span className={styles.kicker}>{copy.original}</span>
            <h2>{copy.monarchArticles}</h2>
            <p>{copy.articleDek}</p>
          </div>
          <Link href="/articles" className={styles.allLink}>{copy.archive}</Link>
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
                  <strong>{copy.read}</strong>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className={styles.filmBridge}>
        <div>
          <span className={styles.kicker}>{copy.fromFilms}</span>
          <h2>{copy.filmTitle}</h2>
          <p>{copy.filmDek}</p>
        </div>
        <Link href="/documentary">{copy.enterFilms} <span>↗</span></Link>
      </section>

      <section id="newsletter" className={styles.newsletter}>
        <span className={styles.kicker}>{copy.newsletter}</span>
        <h2>{copy.newsletterTitle}</h2>
        <p>{copy.newsletterDek}</p>
        {emailStatus === 'sent' ? (
          <div className={styles.confirmation}>{copy.thanks}</div>
        ) : (
          <form onSubmit={submitNewsletter}>
            <label className="sr-only" htmlFor="news-email">{copy.email}</label>
            <input id="news-email" type="email" required placeholder="your@email.com" value={email} onChange={(event) => setEmail(event.target.value)} />
            <button disabled={emailStatus === 'loading'}>{emailStatus === 'loading' ? copy.subscribing : copy.subscribeButton}</button>
          </form>
        )}
        {emailStatus === 'error' && <p className={styles.formError}>{copy.error}</p>}
      </section>

      <footer className={styles.footer}>
        <Image src="/logos/combined-gold.png" alt="The Monarch Report" width={554} height={80} />
        <p>Independent reporting on Korea, democracy and freedom of belief across Asia.</p>
        <div><a href={siteConfig.x}>𝕏</a><Link href="/articles">Articles</Link><Link href="/documentary">Films</Link></div>
      </footer>
    </main>
  );
}
