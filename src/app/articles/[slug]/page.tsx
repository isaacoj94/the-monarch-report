import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { articles, articleSlug, articleBySlug, articleCategory, articleLang } from '@/lib/articles';
import type { ArticleBlock } from '@/lib/articles';
import ThemeToggle from '@/components/ThemeToggle';

const categoryColors: Record<string, { color: string; label: string }> = {
  korea: { color: '#ef4444', label: 'KOREA' },
  japan: { color: '#f59e0b', label: 'JAPAN' },
  democracy: { color: '#3b82f6', label: 'DEMOCRACY' },
  economy: { color: '#06b6d4', label: 'ECONOMY' },
  religion: { color: '#a855f7', label: 'RELIGION' },
};

export function generateStaticParams() {
  return articles.map(a => ({ slug: articleSlug(a) }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = articleBySlug(slug);
  if (!article) return { title: 'Article Not Found' };
  return {
    title: `${article.title} | The Monarch Report`,
    description: article.previewText,
    openGraph: {
      title: article.title,
      description: article.previewText,
      images: article.coverImage ? [article.coverImage] : [],
    },
  };
}

function renderStyledText(text: string, styles?: { style: string; offset: number; length: number }[]) {
  if (!styles || styles.length === 0) return text;

  // Build character-level style map
  const charStyles: Set<string>[] = Array.from({ length: text.length }, () => new Set());
  for (const s of styles) {
    for (let i = s.offset; i < s.offset + s.length && i < text.length; i++) {
      charStyles[i].add(s.style);
    }
  }

  // Group consecutive chars with same styles into segments
  const segments: { text: string; bold: boolean; italic: boolean }[] = [];
  let i = 0;
  while (i < text.length) {
    const bold = charStyles[i].has('bold') || charStyles[i].has('BOLD');
    const italic = charStyles[i].has('italic') || charStyles[i].has('ITALIC');
    let j = i + 1;
    while (j < text.length) {
      const b2 = charStyles[j].has('bold') || charStyles[j].has('BOLD');
      const i2 = charStyles[j].has('italic') || charStyles[j].has('ITALIC');
      if (b2 !== bold || i2 !== italic) break;
      j++;
    }
    segments.push({ text: text.slice(i, j), bold, italic });
    i = j;
  }

  return (
    <>
      {segments.map((seg, idx) => {
        let el: React.ReactNode = seg.text;
        if (seg.bold) el = <strong key={idx} className="text-tm-heading font-bold">{el}</strong>;
        if (seg.italic) el = <em key={idx}>{el}</em>;
        if (!seg.bold && !seg.italic) return <span key={idx}>{el}</span>;
        return el;
      })}
    </>
  );
}

function ArticleBlock({ block, index }: { block: ArticleBlock; index: number }) {
  switch (block.type) {
    case 'heading':
      if (block.level === 1) {
        return <h2 className="text-2xl font-bold text-tm-heading mt-10 mb-4 leading-tight">{block.text}</h2>;
      }
      return <h3 className="text-xl font-bold text-tm-heading mt-8 mb-3 leading-tight">{block.text}</h3>;

    case 'paragraph':
      if (!block.text.trim()) return <div className="h-4" />;
      return (
        <p className="text-tm-body text-base leading-[1.8] mb-4 font-serif">
          {renderStyledText(block.text, block.styles)}
        </p>
      );

    case 'blockquote':
      return (
        <blockquote className="border-l-2 border-tm-gold pl-5 py-1 my-5 bg-tm-card rounded-r-lg">
          <p className="text-tm-secondary text-base leading-[1.8] italic font-serif">
            {renderStyledText(block.text, block.styles)}
          </p>
        </blockquote>
      );

    case 'list-item':
      return (
        <li className="text-tm-body text-base leading-[1.8] mb-2 font-serif ml-6 list-disc">
          {renderStyledText(block.text, block.styles)}
        </li>
      );

    case 'image':
      if (!block.imageUrl) return null;
      return (
        <figure className="my-6">
          <img
            src={block.imageUrl}
            alt=""
            className="w-full rounded-lg border border-tm-border"
            loading="lazy"
          />
        </figure>
      );

    default:
      return null;
  }
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = articleBySlug(slug);

  if (!article) notFound();

  const cat = articleCategory(article);
  const catInfo = categoryColors[cat] || categoryColors.korea;
  const lang = articleLang(article);
  const dateStr = new Date(article.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-tm-page">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-tm-page/95 backdrop-blur-sm border-b border-tm-border-subtle">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <Image src="/logos/combined-gold.png" alt="The Monarch Report" width={554} height={80} className="h-7 w-auto" priority />
          </Link>
          <div className="flex items-center gap-3 text-xs font-mono">
            <Link href="/articles" className="text-tm-secondary hover:text-tm-heading transition-colors">All Articles</Link>
            <Link href="/" className="text-tm-secondary hover:text-tm-heading transition-colors">Home</Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Cover Image */}
      {article.coverImage && (
        <div className="relative w-full h-64 md:h-96">
          <img
            src={article.coverImage}
            alt={article.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-tm-page via-tm-page/50 to-transparent" />
        </div>
      )}

      {/* Article Content */}
      <article className="max-w-3xl mx-auto px-4 -mt-20 relative z-10 pb-16">
        {/* Meta */}
        <div className="flex items-center gap-3 mb-4">
          <span
            className="text-[9px] font-mono font-bold tracking-widest px-2 py-0.5 rounded"
            style={{ color: catInfo.color, backgroundColor: catInfo.color + '15', border: `1px solid ${catInfo.color}30` }}
          >
            {catInfo.label}
          </span>
          <span className="text-tm-faint text-xs font-mono">{dateStr}</span>
          {lang !== 'en' && (
            <span className="text-tm-faint text-[10px] font-mono border border-tm-border-hover px-1.5 py-0.5 rounded">
              {lang === 'ko' ? '한국어' : '日本語'}
            </span>
          )}
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-tm-heading leading-tight mb-4">
          {article.title}
        </h1>

        {/* Author + Stats */}
        <div className="flex items-center justify-between border-b border-tm-border-subtle pb-4 mb-8">
          <div className="flex items-center gap-2">
            <span className="text-sm font-mono text-tm-secondary">The Monarch Report</span>
            <span className="text-tm-ghost">·</span>
            <a
              href={`https://x.com/monarchreport25/status/${article.tweetId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-mono text-tm-gold hover:text-tm-gold-hover transition-colors"
            >
              View on 𝕏
            </a>
          </div>
          <div className="flex items-center gap-3 text-tm-faint text-xs font-mono">
            <span>{article.likes.toLocaleString()} likes</span>
            <span>{article.views.toLocaleString()} views</span>
          </div>
        </div>

        {/* Body */}
        <div className="article-body">
          {article.blocks.map((block, i) => (
            <ArticleBlock key={i} block={block as ArticleBlock} index={i} />
          ))}
        </div>

        {/* Sources */}
        {article.links.length > 0 && (
          <div className="mt-10 pt-6 border-t border-tm-border-subtle">
            <h3 className="text-sm font-mono font-bold text-tm-secondary uppercase tracking-wider mb-3">Sources</h3>
            <ul className="space-y-1.5">
              {article.links.map((link, i) => (
                <li key={i}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-mono text-tm-gold hover:text-tm-gold-hover transition-colors break-all"
                  >
                    {link.url}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Footer CTA */}
        <div className="mt-12 bg-tm-card border border-tm-border rounded-lg p-6 text-center">
          <p className="text-tm-heading font-bold mb-2">Stay informed.</p>
          <p className="text-tm-secondary text-sm font-mono mb-4">Follow The Monarch Report for investigative journalism on Korea and Japan.</p>
          <div className="flex items-center justify-center gap-3">
            <a
              href="https://x.com/monarchreport25"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2 bg-tm-gold hover:bg-tm-gold-hover text-tm-page font-mono font-bold text-sm rounded transition-colors"
            >
              Follow on 𝕏
            </a>
            <Link
              href="/articles"
              className="px-5 py-2 border border-tm-border-hover hover:border-tm-border-active text-tm-heading font-mono text-sm rounded transition-colors"
            >
              More Articles
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
}
