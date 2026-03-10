import { NextResponse } from 'next/server';

// Apify tweet scraper integration for @monarchreport25
// Reads from the last Apify run's dataset (fast) instead of running the scraper on each request.
// Kicks off a new background run if data is stale.

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

// Read results from the most recent Apify run (fast, no waiting for scraper)
async function readLastRunDataset(): Promise<ApifyTweet[]> {
  const res = await fetch(
    `https://api.apify.com/v2/acts/${ACTOR_ID}/runs/last/dataset/items?token=${APIFY_TOKEN}&limit=50`,
    { next: { revalidate: 900 } } // cache for 15 min at CDN level
  );
  if (!res.ok) {
    throw new Error(`Failed to read last run dataset: ${res.status}`);
  }
  return res.json();
}

// Fire-and-forget: trigger a new scraper run in the background
function triggerNewRun() {
  fetch(
    `https://api.apify.com/v2/acts/${ACTOR_ID}/runs?token=${APIFY_TOKEN}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        handles: [HANDLE],
        tweetsDesired: 50,
        addUserInfo: true,
      }),
    }
  ).catch(() => {}); // fire and forget
}

// Track when we last triggered a run (in-memory, resets on cold start)
let lastRunTriggered = 0;
const RUN_INTERVAL = 30 * 60 * 1000; // 30 minutes

export async function GET() {
  if (!APIFY_TOKEN) {
    return NextResponse.json(
      { tweets: [], articles: [], error: 'APIFY_API_TOKEN not configured' },
      { status: 500 }
    );
  }

  try {
    const rawTweets = await readLastRunDataset();

    const allTweets = rawTweets
      .filter(t => t.type === 'tweet' && !t.isRetweet)
      .map(transformTweet)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const articles = allTweets.filter(t => t.isArticle);
    const tweets = allTweets.filter(t => !t.isArticle);

    // Trigger a background refresh if it's been a while
    if (Date.now() - lastRunTriggered > RUN_INTERVAL) {
      lastRunTriggered = Date.now();
      triggerNewRun();
    }

    return NextResponse.json({ tweets, articles });
  } catch (error) {
    return NextResponse.json(
      { tweets: [], articles: [], error: error instanceof Error ? error.message : 'Failed to fetch tweets' },
      { status: 500 }
    );
  }
}
