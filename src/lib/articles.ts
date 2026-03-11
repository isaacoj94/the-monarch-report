// Article data and types for stored X Articles
// Articles are scraped from X via fxtwitter API and stored as static JSON.
// To add new articles, run the scrape script and update src/data/articles.json.

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
}

// All articles, sorted newest first
export const articles: Article[] = articlesData as Article[];

// Lookup by article ID
export const articleById = new Map(articles.map(a => [a.id, a]));

// Slug from title (for URL-friendly paths)
export function articleSlug(a: Article): string {
  return a.title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80)
    .replace(/-$/, '');
}

// Reverse lookup: slug → article
export function articleBySlug(slug: string): Article | undefined {
  return articles.find(a => articleSlug(a) === slug);
}

// Detect language from title
export function articleLang(a: Article): 'en' | 'ko' | 'ja' {
  // Check for Korean characters (Hangul)
  if (/[\uAC00-\uD7AF]/.test(a.title)) return 'ko';
  // Check for Japanese characters (Hiragana, Katakana, CJK)
  if (/[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]/.test(a.title)) return 'ja';
  return 'en';
}

// Category detection from content
export function articleCategory(a: Article): 'korea' | 'japan' | 'democracy' | 'religion' | 'economy' {
  const text = (a.title + ' ' + a.previewText).toLowerCase();
  if (text.includes('dissolv') || text.includes('family federation') || text.includes('japan') || text.includes('tokyo')) return 'japan';
  if (text.includes('democracy') || text.includes('dpk') || text.includes('court') || text.includes('bill')) return 'democracy';
  if (text.includes('economic') || text.includes('won') || text.includes('kospi')) return 'economy';
  if (text.includes('crackdown') || text.includes('religious') || text.includes('pastor') || text.includes('church') || text.includes('ccp')) return 'religion';
  return 'korea';
}
