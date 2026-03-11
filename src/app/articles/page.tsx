import Image from 'next/image';
import Link from 'next/link';
import { articles, articleSlug, articleCategory, articleLang } from '@/lib/articles';

export const metadata = {
  title: 'Articles | The Monarch Report',
  description: 'In-depth investigative articles on democracy, religious freedom, and human rights in Korea and Japan.',
};

const categoryColors: Record<string, { color: string; label: string }> = {
  korea: { color: '#ef4444', label: 'KOREA' },
  japan: { color: '#f59e0b', label: 'JAPAN' },
  democracy: { color: '#3b82f6', label: 'DEMOCRACY' },
  economy: { color: '#06b6d4', label: 'ECONOMY' },
  religion: { color: '#a855f7', label: 'RELIGION' },
};

export default function ArticlesPage() {
  // Separate English articles from translations
  const enArticles = articles.filter(a => articleLang(a) === 'en');
  const translations = articles.filter(a => articleLang(a) !== 'en');

  return (
    <div className="min-h-screen bg-[#080808]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#080808]/95 backdrop-blur-sm border-b border-[#1a1a1a]">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <Image src="/logos/combined-gold.png" alt="The Monarch Report" width={554} height={80} className="h-7 w-auto" priority />
          </Link>
          <div className="flex items-center gap-3 text-xs font-mono">
            <Link href="/" className="text-[#888] hover:text-white transition-colors">Home</Link>
            <Link href="/dashboard" className="text-[#888] hover:text-white transition-colors">Dashboard</Link>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Page header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-1 h-6 bg-[#b8860b] rounded-full" />
            <h1 className="text-3xl font-bold text-white">Articles</h1>
          </div>
          <p className="text-[#888] font-mono text-sm max-w-2xl">
            In-depth investigative journalism on democracy, religious freedom, and human rights in Korea and Japan.
          </p>
        </div>

        {/* Featured (latest) article */}
        {enArticles[0] && (() => {
          const a = enArticles[0];
          const cat = articleCategory(a);
          const catInfo = categoryColors[cat];
          const dateStr = new Date(a.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
          return (
            <Link href={`/articles/${articleSlug(a)}`} className="block group mb-10">
              <div className="bg-[#111] border border-[#222] rounded-lg overflow-hidden hover:border-[#444] transition-all">
                {a.coverImage && (
                  <img src={a.coverImage} alt={a.title} className="w-full h-64 md:h-80 object-cover" />
                )}
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span
                      className="text-[9px] font-mono font-bold tracking-widest px-2 py-0.5 rounded"
                      style={{ color: catInfo.color, backgroundColor: catInfo.color + '15', border: `1px solid ${catInfo.color}30` }}
                    >
                      {catInfo.label}
                    </span>
                    <span className="text-[#555] text-xs font-mono">{dateStr}</span>
                    <span className="text-[9px] font-mono text-[#b8860b] bg-[#b8860b15] px-2 py-0.5 rounded border border-[#b8860b30]">LATEST</span>
                  </div>
                  <h2 className="text-2xl font-bold text-white group-hover:text-[#b8860b] transition-colors mb-2 leading-tight">
                    {a.title}
                  </h2>
                  <p className="text-[#888] text-sm font-mono leading-relaxed max-w-3xl">{a.previewText}</p>
                  <div className="flex items-center gap-4 mt-4 text-[#555] text-xs font-mono">
                    <span>{a.likes.toLocaleString()} likes</span>
                    <span>{a.views.toLocaleString()} views</span>
                    <span className="ml-auto text-[#b8860b] group-hover:text-[#d4a017] font-bold">Read Article →</span>
                  </div>
                </div>
              </div>
            </Link>
          );
        })()}

        {/* Article grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {enArticles.slice(1).map(a => {
            const cat = articleCategory(a);
            const catInfo = categoryColors[cat];
            const dateStr = new Date(a.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

            return (
              <Link key={a.id} href={`/articles/${articleSlug(a)}`} className="block group">
                <div className="bg-[#111] border border-[#222] rounded-lg overflow-hidden hover:border-[#444] transition-all h-full flex flex-col">
                  <div className="h-0.5" style={{ backgroundColor: catInfo.color }} />
                  {a.coverImage && (
                    <img src={a.coverImage} alt={a.title} className="w-full h-40 object-cover" />
                  )}
                  <div className="p-4 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 mb-3">
                      <span
                        className="text-[8px] font-mono font-bold tracking-widest px-1.5 py-0.5 rounded"
                        style={{ color: catInfo.color, backgroundColor: catInfo.color + '15', border: `1px solid ${catInfo.color}30` }}
                      >
                        {catInfo.label}
                      </span>
                      <span className="text-[#555] text-[10px] font-mono">{dateStr}</span>
                    </div>
                    <h3 className="text-white text-sm font-bold leading-snug group-hover:text-[#b8860b] transition-colors mb-2 flex-1">
                      {a.title}
                    </h3>
                    <p className="text-[#777] text-[11px] font-mono leading-relaxed mb-3 line-clamp-2">
                      {a.previewText}
                    </p>
                    <div className="flex items-center justify-between text-[#555] text-[10px] font-mono pt-2 border-t border-[#1a1a1a]">
                      <span>{a.likes.toLocaleString()} likes · {a.views.toLocaleString()} views</span>
                      <span className="text-[#b8860b] font-bold">Read →</span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Translations section */}
        {translations.length > 0 && (
          <div className="mt-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-6 bg-[#666] rounded-full" />
              <div>
                <h2 className="text-lg font-bold text-white">Translations</h2>
                <p className="text-[#666] text-xs font-mono">Articles available in Korean and Japanese</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {translations.map(a => {
                const lang = articleLang(a);
                const dateStr = new Date(a.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                return (
                  <Link key={a.id} href={`/articles/${articleSlug(a)}`} className="block group">
                    <div className="bg-[#111] border border-[#222] rounded-lg p-4 hover:border-[#444] transition-all flex gap-4">
                      {a.coverImage && (
                        <img src={a.coverImage} alt={a.title} className="w-24 h-24 object-cover rounded border border-[#222] flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-[10px] font-mono text-[#555] border border-[#333] px-1.5 py-0.5 rounded">
                            {lang === 'ko' ? '한국어' : '日本語'}
                          </span>
                          <span className="text-[#555] text-[10px] font-mono">{dateStr}</span>
                        </div>
                        <h3 className="text-white text-sm font-bold leading-snug group-hover:text-[#b8860b] transition-colors">
                          {a.title}
                        </h3>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-[#1a1a1a] bg-[#060606]">
        <div className="max-w-6xl mx-auto px-4 py-6 flex items-center justify-between">
          <p className="text-[10px] font-mono text-[#333]">© 2026 The Monarch Report</p>
          <div className="flex gap-4 text-[11px] font-mono">
            <Link href="/" className="text-[#666] hover:text-white transition-colors">Home</Link>
            <a href="https://x.com/monarchreport25" target="_blank" rel="noopener noreferrer" className="text-[#666] hover:text-white transition-colors">𝕏</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
