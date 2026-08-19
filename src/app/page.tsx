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

const impactByCategory: Record<string, Record<'en' | 'ko' | 'ja', BriefImpact>> = {
  legislation: {
    en: {
      people: 'Changes to law can alter speech, court access and the protections available to ordinary citizens.',
      companies: 'New enforcement powers can change compliance exposure, litigation risk and investor confidence.',
    },
    ko: {
      people: '법이 바뀌면 발언과 재판, 시민이 기대하는 보호가 달라진다.',
      companies: '집행 권한이 커지면 준법 부담과 소송, 투자 심리가 흔들린다.',
    },
    ja: {
      people: '法が変われば、発言と裁判、市民が頼る保護が変わる。',
      companies: '執行権限が広がれば、コンプライアンスと訴訟、投資心理が揺れる。',
    },
  },
  'religious-freedom': {
    en: {
      people: 'The precedent affects how freely communities can organize, worship and participate in public life.',
      companies: 'Institutional targeting can signal wider rule-of-law and reputation risks for organizations operating in Korea.',
    },
    ko: {
      people: '선례가 남으면 모여 예배하고 공론장에 서는 일이 좁아진다.',
      companies: '특정 단체를 겨냥하면 한국에서 활동하는 조직의 법치와 평판 위험이 커진다.',
    },
    ja: {
      people: '先例が残れば、集い、礼拝し、公の場に出ることが狭まる。',
      companies: '特定の団体を狙えば、韓国で活動する組織の法治と評判のリスクが膨らむ。',
    },
  },
  'court-case': {
    en: {
      people: 'The ruling tests due process and the balance between state power and individual liberty.',
      companies: 'Court independence and predictable enforcement are core conditions for long-term investment.',
    },
    ko: {
      people: '판결은 적법절차와, 국가권력과 개인의 자유 사이 균형을 시험한다.',
      companies: '법원의 독립과 예측 가능한 집행이 장기 투자의 전제다.',
    },
    ja: {
      people: '判決は適正手続と、国家権力と個人の自由の均衡を試す。',
      companies: '裁判所の独立と予測可能な執行が、長期投資の前提だ。',
    },
  },
  corporate: {
    en: {
      people: 'Regulatory actions can affect jobs, services, privacy and household costs.',
      companies: 'The case may influence foreign investment, governance expectations and operational risk.',
    },
    ko: {
      people: '규제 조치는 일자리와 서비스, 개인정보, 가계 부담으로 번진다.',
      companies: '사건은 외국인 투자와 지배구조, 운영 위험에 파문을 남긴다.',
    },
    ja: {
      people: '規制は雇用、サービス、個人情報、家計負担へと広がる。',
      companies: '事件は海外投資、ガバナンス、事業リスクに波紋を残す。',
    },
  },
  'foreign-policy': {
    en: {
      people: 'Security and alliance choices shape daily safety, public trust and Korea’s place in the region.',
      companies: 'Geopolitical shifts affect trade, sanctions, supply chains and market access.',
    },
    ko: {
      people: '안보와 동맹의 선택이 일상의 안전과 신뢰, 한국의 자리를 가른다.',
      companies: '지정학의 이동은 무역과 제재, 공급망, 시장 접근을 흔든다.',
    },
    ja: {
      people: '安保と同盟の選択が、日常の安全と信頼、韓国の位置を分ける。',
      companies: '地政学の揺れは貿易、制裁、供給網、市場アクセスを揺さぶる。',
    },
  },
  media: {
    en: {
      people: 'Who controls the public square shapes what citizens can hear and say.',
      companies: 'Media-rule changes alter reputation risk, advertising markets and political exposure.',
    },
    ko: {
      people: '공론장을 누가 쥐느냐가, 시민이 듣고 말할 수 있는 범위를 정한다.',
      companies: '미디어 규칙이 바뀌면 평판과 광고, 정치 노출이 달라진다.',
    },
    ja: {
      people: '言論の場を誰が握るかが、市民が聞き、話せる範囲を決める。',
      companies: 'メディアのルールが変われば、評判と広告、政治的露出が変わる。',
    },
  },
};

const categoryLabels = {
  en: { legislation: 'Legislation', 'religious-freedom': 'Religious freedom', 'court-case': 'Court case', corporate: 'Business', 'foreign-policy': 'Foreign policy', media: 'Media', korea: 'Korea', japan: 'Japan', democracy: 'Democracy', economy: 'Economy', religion: 'Religion', 'martial-law': 'Martial law', 'church-raid': 'Religious freedom', military: 'Military' },
  ko: { legislation: '입법', 'religious-freedom': '종교의 자유', 'court-case': '재판', corporate: '기업', 'foreign-policy': '외교·안보', media: '미디어', korea: '한국', japan: '일본', democracy: '민주주의', economy: '경제', religion: '종교', 'martial-law': '계엄', 'church-raid': '종교의 자유', military: '군' },
  ja: { legislation: '立法', 'religious-freedom': '信教の自由', 'court-case': '裁判', corporate: '企業', 'foreign-policy': '外交・安保', media: 'メディア', korea: '韓国', japan: '日本', democracy: '民主主義', economy: '経済', religion: '宗教', 'martial-law': '戒厳', 'church-raid': '信教の自由', military: '軍' },
} as const;

const sourceType = (source: string, locale: keyof typeof homeCopy) => {
  const labels = {
    en: { reference: 'Reference source', primary: 'Primary record', reporting: 'Published reporting' },
    ko: { reference: '참고', primary: '1차 자료', reporting: '보도' },
    ja: { reference: '参考', primary: '一次資料', reporting: '報道' },
  }[locale];
  if (/wikipedia/i.test(source)) return labels.reference;
  if (/court|assembly|ministry|un\b/i.test(source)) return labels.primary;
  return labels.reporting;
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
    edition: '서울 · 한국어판', now: '오늘', articles: '기사', data: '데이터', films: '모나크 필름스', subscribe: '무료 구독',
    desk: '편집국', happening: '오늘의 주요 뉴스', happeningDek: '숫자와 맥락으로 정리한 한국 현안.', verified: '확인',
    people: '가계', companies: '기업', mattersPeople: '가계에 미치는 영향', mattersCompanies: '기업에 미치는 영향',
    closeProgression: '경과 닫기', viewProgression: '경과 보기',
    original: '심층 취재', monarchArticles: '모나크 리포트', articleDek: '한국과 아시아의 변화가 가계와 기업에 남기는 흔적.', archive: '기사 더 보기 →', read: '기사 읽기 →',
    fromFilms: '모나크 필름스', filmTitle: '기사 한 줄로는 담기지 않는 이야기', filmDek: '장편 다큐멘터리 《You’re Next: Do Nothing》을 시작으로, 지금 만들고 있는 작품들.', enterFilms: '모나크 필름스 입장',
    newsletter: '뉴스레터', newsletterTitle: '헤드라인 뒤에 있는 한국', newsletterDek: '정책과 현안이 가계와 사업에 미치는 변화를 짧게 전합니다.', thanks: '구독 신청이 완료됐습니다.', subscribing: '등록 중', subscribeButton: '무료 구독', email: '이메일', error: '등록에 실패했습니다. 잠시 후 다시 시도해 주십시오.',
  },
  ja: {
    edition: 'ソウル · 日本語版', now: '今日', articles: '記事', data: 'データ', films: 'モナーク・フィルムズ', subscribe: '無料購読',
    desk: '編集局', happening: 'きょうの主要ニュース', happeningDek: '数字と文脈で読む、韓国のいま。', verified: '確認済み',
    people: '家計', companies: '企業', mattersPeople: '家計への影響', mattersCompanies: '企業への影響',
    closeProgression: '経緯を閉じる', viewProgression: '経緯を見る',
    original: '深掘り取材', monarchArticles: 'モナーク・レポート', articleDek: '韓国とアジアの変化が、家計と企業に残す痕跡。', archive: '記事をもっと見る →', read: '記事を読む →',
    fromFilms: 'モナーク・フィルムズ', filmTitle: '見出し一行では収まらない話', filmDek: '長編ドキュメンタリー『You’re Next: Do Nothing』を皮切りに、いま制作中の作品。', enterFilms: 'モナーク・フィルムズへ',
    newsletter: 'ニュースレター', newsletterTitle: '見出しの向こうにある韓国', newsletterDek: '政策と懸案が家計と事業に及ぼす変化を、短く届ける。', thanks: '購読の登録が完了しました。', subscribing: '登録中', subscribeButton: '無料購読', email: 'メールアドレス', error: '登録できませんでした。しばらくしてからお試しください。',
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
  const latestArticles = useMemo(() => {
    const localized = articles.filter((article) => articleLang(article) === locale);
    return (localized.length > 0 ? localized : articles.filter((article) => articleLang(article) === 'en')).slice(0, 6);
  }, [locale]);
  const dateLocale = locale === 'ko' ? 'ko-KR' : locale === 'ja' ? 'ja-JP' : 'en-US';

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
            <Link href="/films">{copy.films}</Link>
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
            <small className={styles.freshnessNote}>{copy.verified} · {locale === 'ko' ? '2024년 1월–2026년 8월 · 8월 19일 확인' : locale === 'ja' ? '2024年1月–2026年8月 · 8月19日確認' : KOREA_TIMELINE_RANGE_LABEL}</small>
          </div>
          <div className={styles.impactSwitch} role="group" aria-label="Choose impact perspective">
            <button aria-pressed={impactView === 'people'} onClick={() => setImpactView('people')}>{copy.people}</button>
            <button aria-pressed={impactView === 'companies'} onClick={() => setImpactView('companies')}>{copy.companies}</button>
          </div>
        </div>

        <div className={styles.briefGrid}>
          {latestBriefs.map((brief, index) => {
            const briefTitle = locale === 'ko' ? brief.titleKo ?? brief.title : locale === 'ja' ? brief.titleJa ?? brief.title : brief.title;
            const briefDescription = locale === 'ko' ? brief.descriptionKo ?? brief.description : locale === 'ja' ? brief.descriptionJa ?? brief.description : brief.description;
            const localizedImpact = (impactByCategory[brief.category] ?? impactByCategory.legislation)[locale][impactView];
            const briefKey = `${brief.date}-${brief.title}`;
            const briefIndex = koreaTimeline.findIndex((item) => item.date === brief.date && item.title === brief.title);
            const progression = koreaTimeline
              .slice(0, briefIndex + 1)
              .filter((item) => item.category === brief.category)
              .slice(-4);
            return (
              <article className={index === 0 ? styles.leadBrief : styles.brief} key={briefKey}>
                <div className={styles.briefMeta}>
                  <span>{categoryLabels[locale][brief.category as keyof typeof categoryLabels.en] ?? brief.category}</span>
                  <time>{new Date(brief.date).toLocaleDateString(dateLocale, { year: 'numeric', month: 'short', day: 'numeric' })}</time>
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
                            <time>{new Date(event.date).toLocaleDateString(dateLocale, { year: 'numeric', month: 'short', day: 'numeric' })}</time>
                            <div><strong>{locale === 'ko' ? event.titleKo ?? event.title : locale === 'ja' ? event.titleJa ?? event.title : event.title}</strong><a href={event.sourceUrl} target="_blank" rel="noopener noreferrer">{event.source} ↗</a></div>
                          </li>
                        ))}
                      </ol>
                    )}
                  </div>
                )}
                <a href={brief.sourceUrl} target="_blank" rel="noopener noreferrer" className={styles.sourceLink}>
                  {sourceType(brief.source, locale)} · {brief.source} ↗
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
                  <span>{categoryLabels[locale][category as keyof typeof categoryLabels.en] ?? category} · {new Date(article.createdAt).toLocaleDateString(dateLocale, { month: 'short', day: 'numeric' })}</span>
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
        <Link href="/films">{copy.enterFilms} <span>↗</span></Link>
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
        <div><a href={siteConfig.x}>𝕏</a><Link href="/articles">Articles</Link><Link href="/films">Films</Link></div>
      </footer>
    </main>
  );
}
