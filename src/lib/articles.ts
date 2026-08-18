// Article archive for previously imported X Articles.
// New X material is collected as unpublished desk drafts — never written here automatically.

import articlesData from '@/data/articles.json';

export interface ArticleBlock {
  type: 'paragraph' | 'heading' | 'blockquote' | 'list-item' | 'image';
  text: string;
  imageUrl?: string;
  level?: number;
  listType?: 'ordered' | 'unordered';
  styles?: { style: string; offset: number; length: number }[];
}

export interface ArticleImage {
  url: string;
  width: number;
  height: number;
  type: 'cover' | 'inline';
}

export interface ArticleLink {
  url: string;
  text: string;
}

export interface Article {
  id: string;
  tweetId: string;
  title: string;
  previewText: string;
  createdAt: string;
  coverImage: string | null;
  likes: number;
  views: number;
  retweets: number;
  bookmarks: number;
  blocks: ArticleBlock[];
  images: ArticleImage[];
  links: ArticleLink[];
  author?: string;
  editor?: string;
  revisedAt?: string;
}

export type ArticleLang = 'en' | 'ko' | 'ja' | 'zh';
export type ArticleCategory = 'korea' | 'japan' | 'democracy' | 'religion' | 'economy';

const TWITTER_EPOCH_MS = 1288834974657;
const UNIX_EPOCH_GUARD = Date.parse('2006-03-21T00:00:00.000Z');
const FRESH_MS = 14 * 24 * 60 * 60 * 1000;

export const articles: Article[] = articlesData as Article[];

export const articleById = new Map(articles.map((a) => [a.id, a]));

export function snowflakeToDate(id: string): Date | null {
  if (!/^\d{10,}$/.test(id)) return null;
  try {
    const ms = Number(BigInt(id) >> BigInt(22)) + TWITTER_EPOCH_MS;
    if (!Number.isFinite(ms) || ms < UNIX_EPOCH_GUARD) return null;
    return new Date(ms);
  } catch {
    return null;
  }
}

export function articleDate(a: Article): Date {
  const parsed = Date.parse(a.createdAt);
  if (Number.isFinite(parsed) && parsed >= UNIX_EPOCH_GUARD) {
    return new Date(parsed);
  }
  return snowflakeToDate(a.tweetId) ?? snowflakeToDate(a.id) ?? new Date(parsed || 0);
}

export function articleIsFresh(a: Article, withinMs = FRESH_MS): boolean {
  return Date.now() - articleDate(a).getTime() <= withinMs;
}

export function articleAuthor(a: Article): string {
  return a.author?.trim() || 'The Monarch Report';
}

function rawSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80)
    .replace(/-$/, '');
}

const slugById = new Map<string, string>();
const articleBySlugMap = new Map<string, Article>();

function buildSlugIndex() {
  const used = new Set<string>();
  for (const article of articles) {
    let base = rawSlug(article.title);
    if (base.length < 4) {
      base = `article-${article.tweetId || article.id}`;
    }
    let slug = base;
    if (used.has(slug)) {
      slug = `${base.slice(0, 70)}-${(article.tweetId || article.id).slice(-8)}`;
    }
    let n = 2;
    while (used.has(slug)) {
      slug = `${base.slice(0, 64)}-${n++}`;
    }
    used.add(slug);
    slugById.set(article.id, slug);
    articleBySlugMap.set(slug, article);
  }
}

buildSlugIndex();

export function articleSlug(a: Article): string {
  return slugById.get(a.id) ?? rawSlug(a.title) ?? a.id;
}

export function articleBySlug(slug: string): Article | undefined {
  return articleBySlugMap.get(slug);
}

function detectScript(sample: string): ArticleLang | null {
  if (/[\uAC00-\uD7AF]/.test(sample)) return 'ko';
  // Kana is the reliable Japanese signal. Han-only text is usually Chinese.
  if (/[\u3040-\u309F\u30A0-\u30FF]/.test(sample)) return 'ja';
  if (/[\u4E00-\u9FFF]/.test(sample)) return 'zh';
  return null;
}

export function articleLang(a: Article): ArticleLang {
  const titleScript = detectScript(a.title);
  if (titleScript && !/[A-Za-z]{4,}/.test(a.title)) return titleScript;
  if (/[A-Za-z]{4,}/.test(a.title)) return 'en';
  return detectScript(a.previewText ?? '') ?? 'en';
}

export function articleLangLabel(lang: ArticleLang): string {
  if (lang === 'ko') return '한국어';
  if (lang === 'ja') return '日本語';
  if (lang === 'zh') return '中文';
  return 'EN';
}

export function articleCategory(a: Article): ArticleCategory {
  const text = `${a.title} ${a.previewText}`.toLowerCase();

  const korea =
    /korea|korean|seoul|busan|dpk|lee jae|yoon suk|hak ja han|한학자|한국|서울|이재명|윤석열/.test(
      text,
    );
  const japan = /japan|tokyo|mext|일본|日本|東京/.test(text);
  const religion =
    /family federation|unification church|pastor|church|religious|religion|dissolution|iccpp|iccfr|가정연합|통일교|宗教|信仰|교회|목사/.test(
      text,
    );
  const japanCourt =
    /tokyo (district|high|supreme)|mext|dissol/.test(text) && japan && !korea;

  if (japanCourt) return 'japan';
  if (religion && korea && !japan) return 'religion';
  if (religion && japan && !korea) return 'japan';
  if (religion) return 'religion';
  if (/economic|kospi|\bwon\b|inflation|household debt|환율/.test(text)) return 'economy';
  if (
    korea &&
    /democracy|martial law|impeach|election|court|bill|legislation|계엄/.test(text)
  ) {
    return 'democracy';
  }
  if (japan && !korea) return 'japan';
  return 'korea';
}

export const publishedEnglishArticles = articles
  .filter((a) => articleLang(a) === 'en')
  .slice()
  .sort((a, b) => articleDate(b).getTime() - articleDate(a).getTime());
