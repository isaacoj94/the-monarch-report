import { NextResponse } from 'next/server';

// Apify tweet scraper integration for @monarchreport25
// Caches results for 15 minutes to avoid excessive API calls

const APIFY_TOKEN = process.env.APIFY_API_TOKEN;
const ACTOR_ID = 'apidojo~tweet-scraper';
const HANDLE = 'monarchreport25';

// X Articles have URLs matching this pattern: x.com/i/article/{id}
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
  authorName: string;
  authorHandle: string;
  authorAvatar: string;
  authorVerified: boolean;
  links: { display: string; url: string }[];
}

// In-memory cache
let cache: { data: { tweets: TweetData[]; articles: TweetData[] }; timestamp: number } | null = null;
const CACHE_TTL = 15 * 60 * 1000; // 15 minutes

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

  const links = (raw.entities?.urls || [])
    .filter(u => !u.expanded_url.includes('pic.x.com') && !u.expanded_url.includes('pic.twitter.com'))
    // For articles, filter out the x.com/i/article link itself (it's the article, not an external link)
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
    authorName: raw.author?.name || 'The Monarch Report',
    authorHandle: raw.author?.userName || HANDLE,
    authorAvatar: raw.author?.profilePicture || '',
    authorVerified: raw.author?.isBlueVerified || false,
    links,
  };
}

async function fetchFromApify(): Promise<ApifyTweet[]> {
  if (!APIFY_TOKEN) {
    throw new Error('APIFY_API_TOKEN not configured');
  }

  const res = await fetch(
    `https://api.apify.com/v2/acts/${ACTOR_ID}/run-sync-get-dataset-items?token=${APIFY_TOKEN}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        handles: [HANDLE],
        tweetsDesired: 50,
        addUserInfo: true,
      }),
    }
  );

  if (!res.ok) {
    throw new Error(`Apify request failed: ${res.status}`);
  }

  return res.json();
}

export async function GET() {
  try {
    // Return cached data if fresh
    if (cache && Date.now() - cache.timestamp < CACHE_TTL) {
      return NextResponse.json(cache.data);
    }

    const rawTweets = await fetchFromApify();

    const allTweets = rawTweets
      .filter(t => t.type === 'tweet' && !t.isRetweet)
      .map(transformTweet)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Articles = tweets that link to an x.com/i/article/ URL
    const articles = allTweets.filter(t => t.isArticle);
    // Regular tweets = everything else
    const tweets = allTweets.filter(t => !t.isArticle);

    const data = { tweets, articles };
    cache = { data, timestamp: Date.now() };

    return NextResponse.json(data);
  } catch (error) {
    // Return cached data even if stale on error
    if (cache) {
      return NextResponse.json(cache.data);
    }
    return NextResponse.json(
      { tweets: [], articles: [], error: error instanceof Error ? error.message : 'Failed to fetch tweets' },
      { status: 500 }
    );
  }
}
