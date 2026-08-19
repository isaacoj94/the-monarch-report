#!/usr/bin/env npx tsx
/**
 * Import only long-form X Articles published by @monarchreport25.
 *
 * By default the script reads the most recent Apify task dataset. Pass
 * --run-task to explicitly start one paid Apify run before importing.
 */

import fs from 'node:fs';
import path from 'node:path';
import { config } from 'dotenv';

config({ path: path.resolve(process.cwd(), '.env.local') });

const APIFY_TOKEN = process.env.APIFY_API_TOKEN;
const APIFY_TASK_ID = 'Lj52A7qeMvb3gQEbZ';
const HANDLE = 'monarchreport25';
const ARTICLE_PATTERN = /(?:x|twitter)\.com\/i\/article\/(\d+)/;
const DATA_PATH = path.resolve(process.cwd(), 'src/data/articles.json');
const SHOULD_RUN_TASK = process.argv.includes('--run-task');

type JsonRecord = Record<string, unknown>;

interface ApifyTweet {
  id: string;
  type: string;
  isRetweet: boolean;
  entities?: { urls?: { expanded_url?: string; expandedUrl?: string }[] };
}

interface ArticleBlock {
  type: string;
  text: string;
  imageUrl?: string;
  level?: number;
  listType?: string;
  styles?: { style: string; offset: number; length: number }[];
}

interface ArticleImage {
  url: string;
  width: number;
  height: number;
  type: 'cover' | 'inline';
}

interface ArticleLink {
  url: string;
  text: string;
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
  blocks: ArticleBlock[];
  images: ArticleImage[];
  links: ArticleLink[];
}

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, init);
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }
  return response.json() as Promise<T>;
}

async function runApifyTask(): Promise<string> {
  console.log('Starting the article-only Apify task...');
  const started = await fetchJson<{ data: { id: string } }>(
    `https://api.apify.com/v2/actor-tasks/${APIFY_TASK_ID}/runs?token=${APIFY_TOKEN}`,
    { method: 'POST' },
  );

  const runId = started.data.id;
  for (let attempt = 0; attempt < 60; attempt += 1) {
    await new Promise((resolve) => setTimeout(resolve, 10_000));
    const run = await fetchJson<{ data: { status: string; defaultDatasetId?: string } }>(
      `https://api.apify.com/v2/actor-runs/${runId}?token=${APIFY_TOKEN}`,
    );

    if (run.data.status === 'SUCCEEDED' && run.data.defaultDatasetId) {
      console.log('Apify article scan completed.');
      return run.data.defaultDatasetId;
    }
    if (['FAILED', 'ABORTED', 'TIMED-OUT'].includes(run.data.status)) {
      throw new Error(`Apify run ended with status ${run.data.status}`);
    }
  }

  throw new Error('Apify run did not finish within 10 minutes');
}

async function getLatestDatasetId(): Promise<string> {
  const run = await fetchJson<{ data: { defaultDatasetId?: string } }>(
    `https://api.apify.com/v2/actor-tasks/${APIFY_TASK_ID}/runs/last?token=${APIFY_TOKEN}`,
  );
  if (!run.data.defaultDatasetId) throw new Error('The Apify task has no dataset');
  return run.data.defaultDatasetId;
}

async function getArticleTweets(datasetId: string): Promise<{ tweetId: string; articleId: string }[]> {
  const tweets = await fetchJson<ApifyTweet[]>(
    `https://api.apify.com/v2/datasets/${datasetId}/items?token=${APIFY_TOKEN}&clean=true&limit=500`,
  );

  const found = new Map<string, { tweetId: string; articleId: string }>();
  for (const tweet of tweets) {
    if (tweet.type !== 'tweet' || tweet.isRetweet) continue;
    for (const url of tweet.entities?.urls ?? []) {
      const match = (url.expanded_url ?? url.expandedUrl ?? '').match(ARTICLE_PATTERN);
      if (match) found.set(match[1], { tweetId: tweet.id, articleId: match[1] });
    }
  }

  console.log(`Found ${found.size} long-form X Article links; ordinary posts were excluded.`);
  return [...found.values()];
}

function asRecord(value: unknown): JsonRecord {
  return value && typeof value === 'object' ? (value as JsonRecord) : {};
}

function asNumber(value: unknown): number {
  return typeof value === 'number' ? value : Number(value) || 0;
}

function mapBlockType(type: string): string {
  if (type.startsWith('header')) return 'heading';
  if (type === 'blockquote') return 'blockquote';
  if (type.includes('list-item')) return 'list-item';
  if (type === 'atomic') return 'image';
  return 'paragraph';
}

async function fetchArticle(tweetId: string): Promise<ExtractedArticle | null> {
  const response = await fetchJson<{ tweet?: JsonRecord }>(
    `https://api.fxtwitter.com/${HANDLE}/status/${tweetId}`,
  );
  const tweet = asRecord(response.tweet);
  const article = asRecord(tweet.article);
  if (!article.id || !article.title) return null;

  const content = asRecord(article.content);
  const rawBlocks = Array.isArray(content.blocks) ? content.blocks.map(asRecord) : [];
  const entityMap = asRecord(content.entityMap);
  const rawMedia = Array.isArray(article.media_entities) ? article.media_entities.map(asRecord) : [];
  const mediaByKey = new Map(rawMedia.map((media) => [String(media.media_key), media]));

  const blocks: ArticleBlock[] = rawBlocks.map((block) => {
    const type = String(block.type ?? 'unstyled');
    if (type === 'atomic') {
      const ranges = Array.isArray(block.entityRanges) ? block.entityRanges.map(asRecord) : [];
      for (const range of ranges) {
        const entity = asRecord(entityMap[String(range.key)]);
        const data = asRecord(entity.data);
        const media = mediaByKey.get(String(data.mediaKey));
        if (entity.type === 'IMAGE' && media) {
          return { type: 'image', text: '', imageUrl: String(media.media_url_https ?? '') };
        }
      }
      return { type: 'image', text: '' };
    }

    const result: ArticleBlock = { type: mapBlockType(type), text: String(block.text ?? '') };
    if (type.startsWith('header')) result.level = type === 'header-one' ? 1 : 2;
    if (type.includes('list-item')) result.listType = type.startsWith('ordered') ? 'ordered' : 'unordered';
    if (Array.isArray(block.inlineStyleRanges) && block.inlineStyleRanges.length > 0) {
      result.styles = block.inlineStyleRanges.map((range) => {
        const style = asRecord(range);
        return {
          style: String(style.style ?? '').toLowerCase(),
          offset: asNumber(style.offset),
          length: asNumber(style.length),
        };
      });
    }
    return result;
  });

  const cover = asRecord(article.cover_media);
  const images: ArticleImage[] = [];
  if (cover.media_url) {
    images.push({
      url: String(cover.media_url),
      width: asNumber(cover.width),
      height: asNumber(cover.height),
      type: 'cover',
    });
  }
  for (const media of rawMedia) {
    const info = asRecord(media.original_info);
    if (media.media_url_https) {
      images.push({
        url: String(media.media_url_https),
        width: asNumber(info.width),
        height: asNumber(info.height),
        type: 'inline',
      });
    }
  }

  const links: ArticleLink[] = [];
  for (const entityValue of Object.values(entityMap)) {
    const entity = asRecord(entityValue);
    const data = asRecord(entity.data);
    if (entity.type === 'LINK' && data.url) {
      links.push({ url: String(data.url), text: String(data.url) });
    }
  }

  return {
    id: String(article.id),
    tweetId,
    title: String(article.title),
    previewText: String(article.preview_text ?? ''),
    createdAt: String(article.created_at),
    coverImage: cover.media_url ? String(cover.media_url) : null,
    likes: asNumber(tweet.likes),
    views: asNumber(tweet.views),
    retweets: asNumber(tweet.retweets),
    bookmarks: asNumber(tweet.bookmarks),
    blocks,
    images,
    links,
  };
}

async function main(): Promise<void> {
  if (!APIFY_TOKEN) throw new Error('APIFY_API_TOKEN is required');

  const existing = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8')) as ExtractedArticle[];
  const existingIds = new Set(existing.map((article) => article.id));
  const datasetId = SHOULD_RUN_TASK ? await runApifyTask() : await getLatestDatasetId();
  const candidates = (await getArticleTweets(datasetId)).filter(({ articleId }) => !existingIds.has(articleId));

  console.log(`${candidates.length} new X Articles need importing.`);
  const fresh: ExtractedArticle[] = [];
  for (const candidate of candidates) {
    const article = await fetchArticle(candidate.tweetId);
    if (article) {
      fresh.push(article);
      console.log(`Imported: ${article.title}`);
    }
    await new Promise((resolve) => setTimeout(resolve, 400));
  }

  if (fresh.length === 0) {
    console.log('No new long-form X Articles were found.');
    return;
  }

  const merged = [...existing, ...fresh].sort(
    (left, right) => Date.parse(right.createdAt) - Date.parse(left.createdAt),
  );
  fs.writeFileSync(DATA_PATH, `${JSON.stringify(merged, null, 2)}\n`);
  console.log(`Saved ${fresh.length} new articles (${merged.length} total).`);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
