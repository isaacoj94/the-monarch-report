'use client';

import Image from 'next/image';
import Link from 'next/link';
import { articles, articleSlug, articleCategory, articleLang } from '@/lib/articles';
import ThemeToggle from '@/components/ThemeToggle';
import { useLocale } from '@/components/LocaleProvider';

const categoryColors: Record<string, { color: string; label: string }> = {
  korea: { color: '#ef4444', label: 'KOREA' },
  japan: { color: '#f59e0b', label: 'JAPAN' },
  democracy: { color: '#3b82f6', label: 'DEMOCRACY' },
  economy: { color: '#06b6d4', label: 'ECONOMY' },
  religion: { color: '#a855f7', label: 'RELIGION' },
};

const pageCopy = {
  en: { home: 'Home', dashboard: 'Data', title: 'Articles', description: 'Independent English-language reporting for people, families, and organizations that need to understand what developments in Korea and across Asia mean in practice.', latest: 'LATEST', read: 'Read Article →', empty: 'No English-language Articles are available yet.' },
  ko: { home: '홈', dashboard: '데이터', title: '한국어 기사', description: '한국과 아시아의 변화가 개인과 가족, 기업에 실제로 어떤 의미인지 이해하는 데 도움이 되는 한국어 기사입니다.', latest: '최신', read: '기사 읽기 →', empty: '현재 등록된 한국어 기사가 없습니다.' },
  ja: { home: 'ホーム', dashboard: 'データ', title: '日本語記事', description: '韓国とアジアの動きが、個人、家族、企業にとって実際に何を意味するのかを理解するための日本語記事です。', latest: '最新', read: '記事を読む →', empty: '現在、日本語の記事はありません。' },
} as const;

export default function ArticlesPage() {
  const { locale } = useLocale();
  const copy = pageCopy[locale];
  const selectedArticles = articles.filter(a => articleLang(a) === locale);
  const dateLocale = locale === 'ko' ? 'ko-KR' : locale === 'ja' ? 'ja-JP' : 'en-US';

  return (
    <div data-theme="light" className="min-h-screen bg-tm-page text-tm-body">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-tm-page/95 backdrop-blur-sm border-b border-tm-border-subtle">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <Image src="/logos/combined-gold.png" alt="The Monarch Report" width={554} height={80} className="h-7 w-auto" priority />
          </Link>
          <div className="flex items-center gap-5 text-xs font-sans font-semibold tracking-wide uppercase">
            <Link href="/" className="text-tm-secondary hover:text-tm-heading transition-colors">{copy.home}</Link>
            <Link href="/dashboard" className="text-tm-secondary hover:text-tm-heading transition-colors">{copy.dashboard}</Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Page header */}
        <div className="mb-14 border-b border-tm-border pb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-px bg-tm-gold" />
            <h1 className="text-5xl md:text-6xl font-serif font-semibold text-tm-heading tracking-tight">{copy.title}</h1>
          </div>
          <p className="text-tm-secondary font-sans text-base leading-relaxed max-w-2xl">
            {copy.description}
          </p>
        </div>

        {/* Featured (latest) article */}
        {selectedArticles[0] && (() => {
          const a = selectedArticles[0];
          const cat = articleCategory(a);
          const catInfo = categoryColors[cat];
          const dateStr = new Date(a.createdAt).toLocaleDateString(dateLocale, { year: 'numeric', month: 'long', day: 'numeric' });
          return (
            <Link href={`/articles/${articleSlug(a)}`} className="block group mb-10">
              <div className="bg-tm-card border border-tm-border overflow-hidden hover:border-tm-border-active transition-all">
                {a.coverImage && (
                  <img src={a.coverImage} alt={a.title} className="w-full h-64 md:h-80 object-cover" />
                )}
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span
                      className="text-[9px] font-sans font-bold tracking-widest px-2 py-0.5 rounded"
                      style={{ color: catInfo.color, backgroundColor: catInfo.color + '15', border: `1px solid ${catInfo.color}30` }}
                    >
                      {catInfo.label}
                    </span>
                    <span className="text-tm-faint text-xs font-sans">{dateStr}</span>
                    <span className="text-[9px] font-sans text-tm-gold bg-[var(--tm-gold-bg)] px-2 py-0.5 rounded border border-[var(--tm-gold-border)]">{copy.latest}</span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-serif font-semibold text-tm-heading group-hover:text-tm-gold transition-colors mb-3 leading-tight tracking-tight">
                    {a.title}
                  </h2>
                  <p className="text-tm-secondary text-base font-sans leading-relaxed max-w-3xl">{a.previewText}</p>
                  <div className="flex items-center gap-4 mt-4 text-tm-faint text-xs font-sans">
                    <span>{a.likes.toLocaleString()} likes</span>
                    <span>{a.views.toLocaleString()} views</span>
                    <span className="ml-auto text-tm-gold group-hover:text-tm-gold-hover font-bold">{copy.read}</span>
                  </div>
                </div>
              </div>
            </Link>
          );
        })()}

        {/* Article grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {selectedArticles.slice(1).map(a => {
            const cat = articleCategory(a);
            const catInfo = categoryColors[cat];
            const dateStr = new Date(a.createdAt).toLocaleDateString(dateLocale, { month: 'short', day: 'numeric', year: 'numeric' });

            return (
              <Link key={a.id} href={`/articles/${articleSlug(a)}`} className="block group">
                <div className="bg-tm-card border border-tm-border overflow-hidden hover:border-tm-border-active transition-all h-full flex flex-col">
                  <div className="h-0.5" style={{ backgroundColor: catInfo.color }} />
                  {a.coverImage && (
                    <img src={a.coverImage} alt={a.title} className="w-full h-40 object-cover" />
                  )}
                  <div className="p-4 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 mb-3">
                      <span
                        className="text-[8px] font-sans font-bold tracking-widest px-1.5 py-0.5 rounded"
                        style={{ color: catInfo.color, backgroundColor: catInfo.color + '15', border: `1px solid ${catInfo.color}30` }}
                      >
                        {catInfo.label}
                      </span>
                      <span className="text-tm-faint text-[10px] font-sans">{dateStr}</span>
                    </div>
                    <h3 className="text-tm-heading text-xl font-serif font-semibold leading-snug group-hover:text-tm-gold transition-colors mb-3 flex-1">
                      {a.title}
                    </h3>
                    <p className="text-tm-muted text-[13px] font-sans leading-relaxed mb-4 line-clamp-3">
                      {a.previewText}
                    </p>
                    <div className="flex items-center justify-between text-tm-faint text-[10px] font-sans pt-2 border-t border-tm-border-subtle">
                      <span>{a.likes.toLocaleString()} likes · {a.views.toLocaleString()} views</span>
                      <span className="text-tm-gold font-bold">{copy.read}</span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {selectedArticles.length === 0 && <p className="text-tm-secondary py-12">{copy.empty}</p>}
      </div>

      {/* Footer */}
      <footer className="border-t border-tm-border-subtle bg-tm-footer">
        <div className="max-w-6xl mx-auto px-4 py-6 flex items-center justify-between">
          <p className="text-[10px] font-sans text-tm-ghost">© 2026 The Monarch Report</p>
          <div className="flex gap-4 text-[11px] font-sans">
            <Link href="/" className="text-tm-muted hover:text-tm-heading transition-colors">Home</Link>
            <a href="https://x.com/monarchreport25" target="_blank" rel="noopener noreferrer" className="text-tm-muted hover:text-tm-heading transition-colors">𝕏</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
