import { NextResponse } from 'next/server';
import { articleMap } from '@/lib/articles';

// Two separate Apify tasks for @monarchreport25:
// 1. monarch-recent (7BwvW5gtNg1gkNleK) — 50 tweets, fast, for the Latest section
// 2. monarch-articles (Lj52A7qeMvb3gQEbZ) — 500 tweets, deep, catches all X articles
//
// IMPORTANT: Must use task IDs, not names — Apify returns 404 for name-based URLs.

const APIFY_TOKEN = process.env.APIFY_API_TOKEN;
const TASK_RECENT = '7BwvW5gtNg1gkNleK';
const TASK_ARTICLES = 'Lj52A7qeMvb3gQEbZ';
const HANDLE = 'monarchreport25';

// Vercel ISR: cache this route's response for 15 minutes at the edge
export const revalidate = 900;

const ARTICLE_URL_PATTERN = /x\.com\/i\/article\/(\d+)/;

interface ApifyTweet {
  type: string;
  id: string;
  url: string;
  text: string;
  fullText: string;
  retweetCount: number;
  replyCount: number;
  likeCount: number;
  quoteCount: number;
  viewCount: number;
  bookmarkCount: number;
  createdAt: string;
  lang: string;
  isReply: boolean;
  isRetweet: boolean;
  isQuote: boolean;
  media?: string[];
  author: {
    userName: string;
    name: string;
    profilePicture: string;
    followers: number;
    isBlueVerified: boolean;
  };
  entities?: {
    urls?: { display_url: string; expanded_url: string; url: string }[];
    hashtags?: { text: string }[];
  };
}

export interface TweetData {
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
  articleTitle: string | null;
  articleSummary: string | null;
  articleCategory: string | null;
  authorName: string;
  authorHandle: string;
  authorAvatar: string;
  authorVerified: boolean;
  links: { display: string; url: string }[];
}

function detectArticle(raw: ApifyTweet): { isArticle: boolean; articleId: string | null } {
  const urls = raw.entities?.urls || [];
  for (const u of urls) {
    const match = u.expanded_url.match(ARTICLE_URL_PATTERN);
    if (match) {
      return { isArticle: true, articleId: match[1] };
    }
  }
  return { isArticle: false, articleId: null };
}

function transformTweet(raw: ApifyTweet): TweetData {
  const { isArticle, articleId } = detectArticle(raw);
  const stored = articleId ? articleMap.get(articleId) : undefined;

  const links = (raw.entities?.urls || [])
    .filter(u => !u.expanded_url.includes('pic.x.com') && !u.expanded_url.includes('pic.twitter.com'))
    .filter(u => !ARTICLE_URL_PATTERN.test(u.expanded_url))
    .map(u => ({ display: u.display_url, url: u.expanded_url }));

  return {
    id: raw.id,
    url: raw.url,
    text: raw.text,
    createdAt: raw.createdAt,
    likeCount: raw.likeCount || 0,
    retweetCount: raw.retweetCount || 0,
    replyCount: raw.replyCount || 0,
    viewCount: raw.viewCount || 0,
    bookmarkCount: raw.bookmarkCount || 0,
    media: raw.media || [],
    isArticle,
    articleId,
    articleUrl: articleId ? `https://x.com/i/article/${articleId}` : null,
    articleTitle: stored?.title || null,
    articleSummary: stored?.summary || null,
    articleCategory: stored?.category || null,
    authorName: raw.author?.name || 'The Monarch Report',
    authorHandle: raw.author?.userName || HANDLE,
    authorAvatar: raw.author?.profilePicture || '',
    authorVerified: raw.author?.isBlueVerified || false,
    links,
  };
}

async function readTaskDataset(taskId: string, limit: number): Promise<ApifyTweet[]> {
  const res = await fetch(
    `https://api.apify.com/v2/actor-tasks/${taskId}/runs/last/dataset/items?token=${APIFY_TOKEN}&limit=${limit}`,
    { next: { revalidate: taskId === TASK_RECENT ? 900 : 3600 } }
  );
  if (!res.ok) return [];
  return res.json();
}

// Fire-and-forget: trigger a task run
function triggerTask(taskId: string) {
  fetch(
    `https://api.apify.com/v2/actor-tasks/${taskId}/runs?token=${APIFY_TOKEN}`,
    { method: 'POST' }
  ).catch(() => {});
}

// In-memory cache: always return last good data even if Apify is slow/down
interface CachedData {
  tweets: TweetData[];
  articles: TweetData[];
  updatedAt: number;
}
let cache: CachedData | null = null;

// Track refresh times per task
const lastTriggered: Record<string, number> = {};
const RECENT_INTERVAL = 30 * 60 * 1000;  // 30 min
const ARTICLES_INTERVAL = 6 * 60 * 60 * 1000; // 6 hours

export async function GET() {
  if (!APIFY_TOKEN) {
    return NextResponse.json(
      { tweets: [], articles: [], error: 'APIFY_API_TOKEN not configured' },
      { status: 500 }
    );
  }

  try {
    // Fetch both datasets in parallel — both are instant reads from last run
    const [recentRaw, deepRaw] = await Promise.all([
      readTaskDataset(TASK_RECENT, 50),
      readTaskDataset(TASK_ARTICLES, 500),
    ]);

    // Recent tweets (non-retweet, non-article)
    const recentTweets = recentRaw
      .filter(t => t.type === 'tweet' && !t.isRetweet)
      .map(transformTweet)
      .filter(t => !t.isArticle)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Articles from the deep scrape
    const articles = deepRaw
      .filter(t => t.type === 'tweet' && !t.isRetweet)
      .map(transformTweet)
      .filter(t => t.isArticle)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Update cache with fresh data
    if (recentTweets.length > 0 || articles.length > 0) {
      cache = { tweets: recentTweets, articles, updatedAt: Date.now() };
    }

    // Trigger background refreshes if stale
    const now = Date.now();
    if (now - (lastTriggered[TASK_RECENT] || 0) > RECENT_INTERVAL) {
      lastTriggered[TASK_RECENT] = now;
      triggerTask(TASK_RECENT);
    }
    if (now - (lastTriggered[TASK_ARTICLES] || 0) > ARTICLES_INTERVAL) {
      lastTriggered[TASK_ARTICLES] = now;
      triggerTask(TASK_ARTICLES);
    }

    return NextResponse.json({ tweets: recentTweets, articles });
  } catch (error) {
    // If Apify fails but we have cached data, return it
    if (cache) {
      return NextResponse.json({ tweets: cache.tweets, articles: cache.articles, cached: true });
    }
    return NextResponse.json(
      { tweets: [], articles: [], error: error instanceof Error ? error.message : 'Failed to fetch tweets' },
      { status: 500 }
    );
  }
}
