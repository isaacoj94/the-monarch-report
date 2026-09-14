'use client';

import type { Article, ArticleBlock as Block } from '@/lib/articles';
import { articleLang, localizedArticle } from '@/lib/articles';
import { ArticleLanguageNotice } from '@/components/LocalizedText';
import { useLocale } from '@/components/LocaleProvider';

function renderStyledText(text: string, styles?: { style: string; offset: number; length: number }[]) {
  if (!styles || styles.length === 0) return text;
  const charStyles: Set<string>[] = Array.from({ length: text.length }, () => new Set());
  for (const s of styles) {
    for (let i = s.offset; i < s.offset + s.length && i < text.length; i++) charStyles[i].add(s.style);
  }
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

function ArticleBlock({ block }: { block: Block }) {
  switch (block.type) {
    case 'heading':
      if (block.level === 1) return <h2 className="text-3xl font-serif font-semibold text-tm-heading mt-12 mb-4 leading-tight">{block.text}</h2>;
      return <h3 className="text-2xl font-serif font-semibold text-tm-heading mt-10 mb-3 leading-tight">{block.text}</h3>;
    case 'paragraph':
      if (!block.text.trim()) return <div className="h-4" />;
      return <p className="text-tm-body text-base leading-[1.8] mb-4 font-serif">{renderStyledText(block.text, block.styles)}</p>;
    case 'blockquote':
      return (
        <blockquote className="border-l-2 border-tm-gold pl-5 py-1 my-5 bg-tm-card rounded-r-lg">
          <p className="text-tm-secondary text-base leading-[1.8] italic font-serif">{renderStyledText(block.text, block.styles)}</p>
        </blockquote>
      );
    case 'list-item':
      return <li className="text-tm-body text-base leading-[1.8] mb-2 font-serif ml-6 list-disc">{renderStyledText(block.text, block.styles)}</li>;
    case 'image':
      if (!block.imageUrl) return null;
      return (
        <figure className="my-6">
          <img src={block.imageUrl} alt="" className="w-full rounded-lg border border-tm-border" loading="lazy" />
        </figure>
      );
    case 'divider':
      return <hr className="my-8 border-t border-tm-border-subtle" />;
    case 'video':
      if (!block.videoUrl || !block.imageUrl) return null;
      return (
        <video className="my-6 w-full rounded-lg border border-tm-border" controls preload="metadata" poster={block.imageUrl}>
          <source src={block.videoUrl} type="video/mp4" />
        </video>
      );
    default:
      return null;
  }
}

export function LocalizedArticleBody({ article }: { article: Article }) {
  const { locale } = useLocale();
  const local = localizedArticle(article, locale);
  const original = articleLang(article);
  return (
    <>
      <h1 className="text-4xl md:text-6xl font-serif font-semibold text-tm-heading leading-[1.02] tracking-tight mb-6">
        {local.title}
      </h1>
      {!local.translated && original === 'en' && locale !== 'en' && (
        <ArticleLanguageNotice articleLocale={original} />
      )}
      <div className="article-body">
        {local.blocks.map((block, i) => (
          <ArticleBlock key={i} block={block} />
        ))}
      </div>
    </>
  );
}
