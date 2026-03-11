#!/usr/bin/env npx tsx
/**
 * Scrape X Articles from @monarchreport25 and update src/data/articles.json
 *
 * Usage:
 *   npx tsx scripts/scrape-articles.ts
 *
 * What it does:
 *   1. Reads the Apify "monarch-articles" task dataset to find article tweet IDs
 *   2. Fetches full article content via fxtwitter API
 *   3. Merges with existing articles (preserves old, adds new)
 *   4. Writes updated src/data/articles.json
 *
 * Requires: APIFY_API_TOKEN in .env.local
 */

import fs from 'fs';
import path from 'path';
import { config } from 'dotenv';

// Load .env.local
config({ path: path.resolve(process.cwd(), '.env.local') });

const APIFY_TOKEN = process.env.APIFY_API_TOKEN;
const TASK_ARTICLES = 'Lj52A7qeMvb3gQEbZ';
const HANDLE = 'monarchreport25';
const ARTICLE_PATTERN = /x\.com\/i\/article\/(\d+)/;
const DATA_PATH = path.resolve(process.cwd(), 'src/data/articles.json');

interface ApifyTweet {
  id: string;
  type: string;
  isRetweet: boolean;
  entities?: {
    urls?: { expanded_url: string }[];
  };
}

interface FxArticle {
  created_at: string;
  modified_at: string;
  id: string;
  title: string;
  preview_text: string;
  cover_media?: {
    media_url: string;
    width: number;
    height: number;
  };
  content?: {
    blocks: FxBlock[];
    entityMap: Record<string, FxEntity>;
  };
  media_entities?: FxMediaEntity[];
}

interface FxBlock {
  type: string;
  text: string;
  inlineStyleRanges?: { style: string; offset: number; length: number }[];
  entityRanges?: { key: number; offset: number; length: number }[];
  data?: Record<string, unknown>;
}

interface FxEntity {
  type: string;
  data?: {
    url?: string;
    mediaKey?: string;
  };
}

interface FxMediaEntity {
  media_key: string;
  media_url_https: string;
  original_info?: { width: number; height: number };
}

interface ExtractedArticle {
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
  blocks: ExtractedBlock[];
  images: ExtractedImage[];
  links: ExtractedLink[];
}

interface ExtractedBlock {
  type: string;
  text: string;
  imageUrl?: string;
  level?: number;
  listType?: string;
  styles?: { style: string; offset: number; length: number }[];
  entityKey?: string;
  entityKeys?: string[];
  entityRanges?: { key: number; offset: number; length: number }[];
}

interface ExtractedImage {
  url: string;
  width: number;
  height: number;
  type: 'cover' | 'inline';
}

interface ExtractedLink {
  url: string;
  text: string;
}

async function fetchJSON(url: string): Promise<unknown> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}: ${url}`);
  return res.json();
}

// Step 1: Get tweet IDs that link to articles from Apify
async function getArticleTweetIds(): Promise<{ tweetId: string; articleId: string }[]> {
  console.log('Fetching article tweet IDs from Apify...');
  const url = `https://api.apify.com/v2/actor-tasks/${TASK_ARTICLES}/runs/last/dataset/items?token=${APIFY_TOKEN}&limit=500`;
  const tweets = (await fetchJSON(url)) as ApifyTweet[];

  const results: { tweetId: string; articleId: string }[] = [];
  for (const t of tweets) {
    if (t.type !== 'tweet' || t.isRetweet) continue;
    for (const u of t.entities?.urls || []) {
      const m = u.expanded_url.match(ARTICLE_PATTERN);
      if (m) {
        results.push({ tweetId: t.id, articleId: m[1] });
        break;
      }
    }
  }

  console.log(`  Found ${results.length} article tweets`);
  return results;
}

// Step 2: Fetch full article content via fxtwitter
async function fetchArticle(tweetId: string): Promise<ExtractedArticle | null> {
  try {
    const url = `https://api.fxtwitter.com/${HANDLE}/status/${tweetId}`;
    const data = (await fetchJSON(url)) as { tweet: { article: FxArticle; likes: number; views: number; retweets: number; bookmarks: number } };
    const tweet = data.tweet;
    const article = tweet.article;

    if (!article || !article.title) {
      console.log(`  [SKIP] ${tweetId} — no article data`);
      return null;
    }

    // Build media lookup
    const mediaMap = new Map<string, FxMediaEntity>();
    for (const m of article.media_entities || []) {
      mediaMap.set(m.media_key, m);
    }

    // Extract blocks
    const blocks: ExtractedBlock[] = [];
    const rawBlocks = article.content?.blocks || [];
    const entityMap = article.content?.entityMap || {};

    for (const block of rawBlocks) {
      const blockType = mapBlockType(block.type);

      // Inline styles
      const styles = (block.inlineStyleRanges || []).map(s => ({
        style: s.style.toLowerCase(),
        offset: s.offset,
        length: s.length,
      }));

      // Check if this is an atomic block (image)
      if (block.type === 'atomic') {
        const entityKeys = (block.entityRanges || []).map(r => String(r.key));
        let imageUrl: string | undefined;

        for (const ek of entityKeys) {
          const entity = entityMap[ek];
          if (entity?.type === 'IMAGE' && entity.data?.mediaKey) {
            const media = mediaMap.get(entity.data.mediaKey);
            if (media) {
              imageUrl = media.media_url_https;
            }
          }
        }

        blocks.push({
          type: 'image',
          text: '',
          imageUrl,
          entityKey: entityKeys[0],
          entityKeys,
        });
      } else {
        const extracted: ExtractedBlock = { type: blockType, text: block.text };
        if (styles.length > 0) extracted.styles = styles;
        if (block.type.includes('header')) {
          extracted.level = block.type === 'header-one' ? 1 : 2;
        }
        if (block.type.includes('list-item')) {
          extracted.listType = block.type.startsWith('ordered') ? 'ordered' : 'unordered';
        }
        blocks.push(extracted);
      }
    }

    // Extract images
    const images: ExtractedImage[] = [];
    if (article.cover_media) {
      images.push({
        url: article.cover_media.media_url,
        width: article.cover_media.width,
        height: article.cover_media.height,
        type: 'cover',
      });
    }
    for (const m of article.media_entities || []) {
      images.push({
        url: m.media_url_https,
        width: m.original_info?.width || 0,
        height: m.original_info?.height || 0,
        type: 'inline',
      });
    }

    // Extract links
    const links: ExtractedLink[] = [];
    for (const [, entity] of Object.entries(entityMap)) {
      if (entity.type === 'LINK' && entity.data?.url) {
        links.push({ url: entity.data.url, text: entity.data.url });
      }
    }

    return {
      id: article.id,
      tweetId,
      title: article.title,
      previewText: article.preview_text || '',
      createdAt: article.created_at,
      coverImage: article.cover_media?.media_url || null,
      likes: tweet.likes || 0,
      views: tweet.views || 0,
      retweets: tweet.retweets || 0,
      bookmarks: tweet.bookmarks || 0,
      blocks,
      images,
      links,
    };
  } catch (err) {
    console.log(`  [ERROR] ${tweetId}: ${err instanceof Error ? err.message : err}`);
    return null;
  }
}

function mapBlockType(raw: string): string {
  if (raw === 'unstyled') return 'paragraph';
  if (raw.startsWith('header')) return 'heading';
  if (raw === 'blockquote') return 'blockquote';
  if (raw.includes('list-item')) return 'list-item';
  if (raw === 'atomic') return 'image';
  return 'paragraph';
}

// Step 3: Merge with existing data
function mergeArticles(existing: ExtractedArticle[], fresh: ExtractedArticle[]): ExtractedArticle[] {
  const byId = new Map(existing.map(a => [a.id, a]));

  for (const article of fresh) {
    byId.set(article.id, article); // overwrite with fresh data
  }

  return Array.from(byId.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

// Main
async function main() {
  if (!APIFY_TOKEN) {
    console.error('Error: APIFY_API_TOKEN not found in .env.local');
    process.exit(1);
  }

  // Load existing articles
  let existing: ExtractedArticle[] = [];
  if (fs.existsSync(DATA_PATH)) {
    existing = JSON.parse(fs.readFileSync(DATA_PATH, 'utf-8'));
    console.log(`Loaded ${existing.length} existing articles`);
  }

  const existingIds = new Set(existing.map(a => a.id));

  // Get article tweet IDs from Apify
  const articleTweets = await getArticleTweetIds();

  // Filter to only new articles
  const newTweets = articleTweets.filter(t => !existingIds.has(t.articleId));
  console.log(`${newTweets.length} new articles to fetch (${articleTweets.length - newTweets.length} already stored)`);

  if (newTweets.length === 0) {
    console.log('No new articles. Done!');
    return;
  }

  // Fetch new articles (with small delay to be nice to fxtwitter)
  const freshArticles: ExtractedArticle[] = [];
  for (const { tweetId, articleId } of newTweets) {
    console.log(`Fetching article ${articleId} (tweet ${tweetId})...`);
    const article = await fetchArticle(tweetId);
    if (article) {
      freshArticles.push(article);
      console.log(`  ✓ "${article.title}" (${article.blocks.length} blocks, ${article.images.length} images)`);
    }
    // Small delay
    await new Promise(r => setTimeout(r, 500));
  }

  console.log(`\nFetched ${freshArticles.length} new articles`);

  // Merge and save
  const merged = mergeArticles(existing, freshArticles);
  fs.writeFileSync(DATA_PATH, JSON.stringify(merged, null, 2));
  console.log(`\nSaved ${merged.length} total articles to ${path.relative(process.cwd(), DATA_PATH)}`);
  console.log('Done! Commit and push to deploy.');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
