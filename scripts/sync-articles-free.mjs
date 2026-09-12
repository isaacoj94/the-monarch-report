#!/usr/bin/env node
// Free browser discovery + public FxTwitter structured article bodies. No env loading.
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { getCookies } from '@steipete/sweet-cookie';

const HANDLE = 'monarchreport25';
export const AUTH_PROFILE_DIRECTORY = 'Profile 4';
export const AUTH_PROFILE_LABEL = 'Yoo Suk';
const AUTH_COOKIE_URL = 'https://x.com/';
const STATE = path.join(os.homedir(), '.hermes/profiles/monarch/state/x-article-sync');
const STATUS = path.join(STATE, 'import-status.json');
const BACKOFF = path.join(STATE, 'auth-backoff.json');
export async function activeBackoff(file, now = Date.now()) {
  try {
    const backoff = JSON.parse(await fs.readFile(file, 'utf8'));
    return backoff.retryAfter > now ? backoff.errorCode : null;
  } catch (error) { if (error.code !== 'ENOENT') throw error; return null; }
}
export async function recordBackoff(file, code, now = Date.now()) {
  if (!['LOGIN_REQUIRED', 'RATE_LIMITED'].includes(code) || await activeBackoff(file, now)) return;
  await atomicJson(file, { errorCode: code, retryAfter: now + 6 * 60 * 60 * 1000 });
}
export function shouldHonorBackoff(code, refreshAuth) {
  return Boolean(code) && !(refreshAuth && code === 'LOGIN_REQUIRED');
}
const DATA = fileURLToPath(new URL('../src/data/articles.json', import.meta.url));
const numericId = value => typeof value === 'string' && /^\d{15,22}$/.test(value);
const fail = code => { throw new Error(code); };
const ERROR_CODES = new Set(['AUTH_COOKIE_ACCESS_FAILED', 'BODY_FETCH_FAILED', 'DATA_CHANGED', 'DISCOVERY_UNVERIFIED', 'DISCOVERY_UPSTREAM_ERROR', 'IDENTITY_MISMATCH', 'IMPORT_FAILED', 'IMPORT_LOCKED', 'INCOMPLETE_BODY', 'INVALID_ARGUMENTS', 'INVALID_DATA', 'LOGIN_REQUIRED', 'RATE_LIMITED', 'TIMEOUT']);
const safeErrorCode = value => ERROR_CODES.has(value) ? value : 'IMPORT_FAILED';
const array = value => Array.isArray(value) ? value : [];
const number = value => Number.isFinite(Number(value)) ? Number(value) : 0;
const safeUrl = value => typeof value === 'string' && /^https:\/\//.test(value) ? value : '';
function mediaDetails(media = {}) {
  return { url: safeUrl(media.media_url_https ?? media.media_url ?? media.media_info?.original_img_url), width: number(media.width ?? media.original_info?.width ?? media.media_info?.original_img_width), height: number(media.height ?? media.original_info?.height ?? media.media_info?.original_img_height) };
}
export function normalizeArticle(payload, candidate) {
  const tweet = payload?.tweet, article = tweet?.article;
  if (!numericId(candidate.tweetId) || !numericId(candidate.articleId) || String(tweet?.id) !== candidate.tweetId || String(article?.id) !== candidate.articleId || tweet?.author?.screen_name?.toLowerCase() !== HANDLE) fail('IDENTITY_MISMATCH');
  const content = article.content;
  if (!article.title?.trim() || !Number.isFinite(Date.parse(article.created_at)) || article.truncated || article.is_truncated || tweet.truncated || !Array.isArray(content?.blocks) || !content.blocks.length) fail('INCOMPLETE_BODY');
  const entities = Array.isArray(content.entityMap) ? Object.fromEntries(content.entityMap.map(e => [String(e.key), e.value])) : (content.entityMap ?? {});
  const media = array(article.media_entities);
  const blocks = content.blocks.map(block => {
    const type = block.type;
    if (type === 'atomic') {
      for (const range of array(block.entityRanges)) {
        const entity = entities[String(range.key)];
        const data = entity?.data ?? {};
        const match = media.find(m => (data.mediaKey != null && m.media_key != null && String(m.media_key) === String(data.mediaKey)) || array(data.mediaItems).some(i => i.mediaId != null && m.media_id != null && String(i.mediaId) === String(m.media_id)));
        if (['IMAGE', 'MEDIA'].includes(entity?.type) && match && mediaDetails(match).url) return { type: 'image', text: '', imageUrl: mediaDetails(match).url };
      }
      fail('INCOMPLETE_BODY'); // Never silently discard unsupported embedded content.
    }
    if (!['unstyled', 'paragraph', 'header-one', 'header-two', 'header-three', 'blockquote', 'ordered-list-item', 'unordered-list-item'].includes(type) || typeof block.text !== 'string') fail('INCOMPLETE_BODY');
    const out = { type: type.startsWith('header') ? 'heading' : type.includes('list-item') ? 'list-item' : type === 'blockquote' ? type : 'paragraph', text: block.text };
    if (type.startsWith('header')) out.level = type === 'header-one' ? 1 : type === 'header-three' ? 3 : 2;
    if (type.includes('list-item')) out.listType = type.startsWith('ordered') ? 'ordered' : 'unordered';
    if (array(block.inlineStyleRanges).length) out.styles = block.inlineStyleRanges.map(s => ({ style: String(s.style).toLowerCase(), offset: number(s.offset), length: number(s.length) }));
    return out;
  });
  const text = blocks.map(b => b.text).join('\n').trim();
  if (!text || text === String(article.preview_text ?? '').trim()) fail('INCOMPLETE_BODY');
  if (typeof article.plain_text === 'string' && article.plain_text.replace(/\s/g, '') !== text.replace(/\s/g, '')) fail('INCOMPLETE_BODY');
  const cover = mediaDetails(article.cover_media);
  const images = [...(cover.url ? [{ ...cover, type: 'cover' }] : []), ...media.map(mediaDetails).filter(m => m.url).map(m => ({ ...m, type: 'inline' }))];
  const links = Object.values(entities).filter(e => e.type === 'LINK' && safeUrl(e.data?.url)).map(e => ({ url: e.data.url, text: e.data.url }));
  return { id: candidate.articleId, tweetId: candidate.tweetId, title: article.title, previewText: String(article.preview_text ?? ''), createdAt: article.created_at, coverImage: cover.url || null, likes: number(tweet.likes), views: number(tweet.views), retweets: number(tweet.retweets), bookmarks: number(tweet.bookmarks), blocks, images, links };
}
function walk(value, visit) {
  if (!value || typeof value !== 'object') return;
  visit(value);
  for (const child of Object.values(value)) walk(child, visit);
}
export function parseDiscovery(payload) {
  const candidates = new Map();
  let verified = false, complete = false;
  // Only inspect the target user's timeline, never recommendations elsewhere.
  const root = payload?.data?.user?.result;
  const timeline = root?.timeline_v2?.timeline ?? root?.timeline?.timeline ?? root?.timeline;
  if (!Array.isArray(timeline?.instructions) || payload.errors?.length) return { candidates: [], verified, complete };
  verified = true;
  walk(timeline.instructions, node => {
    if ((node.type === 'TimelineTerminateTimeline' && node.direction === 'Bottom') || (node.cursorType === 'Bottom' && node.value === '')) complete = true;
    const tweet = node.tweet_results?.result?.tweet ?? node.tweet_results?.result;
    if (!tweet || tweet.legacy?.retweeted_status_result) return;
    const author = tweet.core?.user_results?.result;
    if ((author?.legacy?.screen_name ?? author?.core?.screen_name)?.toLowerCase() !== HANDLE) return;
    const article = tweet.article?.article_results?.result;
    const ids = [article?.rest_id ?? article?.id, ...array(tweet.legacy?.entities?.urls).map(u => /^https:\/\/(?:x|twitter)\.com\/i\/article\/(\d+)(?:[/?#]|$)/.exec(u.expanded_url ?? '')?.[1])];
    for (const articleId of ids) if (numericId(articleId) && numericId(tweet.rest_id)) candidates.set(articleId, { tweetId: tweet.rest_id, articleId });
  });
  return { candidates: [...candidates.values()], verified, complete };
}
async function atomicJson(file, value) {
  await fs.mkdir(path.dirname(file), { recursive: true, mode: 0o700 });
  const temp = `${file}.${process.pid}.${Date.now()}.tmp`;
  try { await fs.writeFile(temp, JSON.stringify(value, null, 2) + '\n', { mode: 0o600, flag: 'wx' }); await fs.rename(temp, file); }
  finally { await fs.rm(temp, { force: true }); }
}
export async function appendArticles(file, fresh, dryRun) {
  const original = await fs.readFile(file, 'utf8');
  const existing = JSON.parse(original);
  if (!Array.isArray(existing)) fail('INVALID_DATA');
  const ids = new Set(existing.map(a => a.id)), tweets = new Set(existing.map(a => a.tweetId));
  const added = [];
  for (const a of fresh) if (!ids.has(a.id) && !tweets.has(a.tweetId)) { added.push(a); ids.add(a.id); tweets.add(a.tweetId); }
  if (added.length && !dryRun) {
    if (await fs.readFile(file, 'utf8') !== original) fail('DATA_CHANGED');
    await atomicJson(file, [...existing, ...added]);
  }
  return added.length;
}
export async function writeStatus(file, update) {
  let previous = {};
  try { previous = JSON.parse(await fs.readFile(file, 'utf8')); } catch (error) { if (error.code !== 'ENOENT') throw error; }
  await atomicJson(file, { status: update.status, errorCode: update.errorCode == null ? null : safeErrorCode(update.errorCode), lastSuccessfulDiscoveryAt: update.lastSuccessfulDiscoveryAt ?? previous.lastSuccessfulDiscoveryAt ?? null, addedCount: update.addedCount ?? 0 });
}
function xDomain(value) {
  if (typeof value !== 'string') return null;
  const domain = value.toLowerCase().replace(/^\./, '');
  return domain === 'x.com' || domain.endsWith('.x.com') ? domain : null;
}
export function mapCookiesForPlaywright(cookies) {
  const mapped = [];
  for (const cookie of array(cookies)) {
    const domain = xDomain(cookie.domain);
    if (!domain || typeof cookie.name !== 'string' || !cookie.name || /[\x00-\x20\x7f()<>@,;:\\"/\[\]?={}]/.test(cookie.name) || typeof cookie.value !== 'string' || /[\r\n\0]/.test(cookie.value)) continue;
    if (cookie.path !== undefined && (typeof cookie.path !== 'string' || !cookie.path.startsWith('/'))) continue;
    const hostOnly = cookie.hostOnly !== false;
    if (!hostOnly && typeof cookie.path !== 'string') continue;
    const out = hostOnly
      ? { name: cookie.name, value: cookie.value, url: `https://${domain}` }
      : { name: cookie.name, value: cookie.value, domain: `.${domain}`, path: cookie.path };
    if (Number.isFinite(cookie.expires) && cookie.expires > 0) out.expires = cookie.expires;
    if (typeof cookie.secure === 'boolean') out.secure = cookie.secure;
    if (typeof cookie.httpOnly === 'boolean') out.httpOnly = cookie.httpOnly;
    if (['Strict', 'Lax', 'None'].includes(cookie.sameSite)) out.sameSite = cookie.sameSite;
    mapped.push(out);
  }
  return mapped;
}
export async function createAuthenticatedContext({ chromiumApi = chromium, cookieReader = getCookies, headless = true } = {}) {
  let cookies;
  try {
    const result = await cookieReader({ url: AUTH_COOKIE_URL, browsers: ['chrome'], chromeProfile: AUTH_PROFILE_DIRECTORY, chromiumBrowser: 'chrome' });
    cookies = mapCookiesForPlaywright(result.cookies);
  } catch { fail('AUTH_COOKIE_ACCESS_FAILED'); }
  if (!cookies.length) fail('AUTH_COOKIE_ACCESS_FAILED');
  let browser;
  try {
    browser = await chromiumApi.launch({ headless, channel: 'chrome', timeout: 15000 });
    const context = await browser.newContext();
    await context.addCookies(cookies);
    return { browser, context };
  } catch {
    await browser?.close().catch(() => {});
    fail('AUTH_COOKIE_ACCESS_FAILED');
  }
}
export function isArticleResponse(url) {
  return /^https:\/\/(?:x\.com|api\.x\.com)\/(?:i\/api\/)?graphql\/[^/]+\/UserArticles(?:Tweets)?(?:\?|$)/.test(url);
}
export async function acquireLock(file) {
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const handle = await fs.open(file, 'wx', 0o600);
      await handle.writeFile(String(process.pid));
      return handle;
    } catch (error) {
      if (error.code !== 'EEXIST') throw error;
      const owner = Number(await fs.readFile(file, 'utf8'));
      if (!Number.isSafeInteger(owner) || owner <= 0) fail('IMPORT_LOCKED');
      try { process.kill(owner, 0); fail('IMPORT_LOCKED'); }
      catch (check) { if (check.code !== 'ESRCH') fail('IMPORT_LOCKED'); }
      if (attempt === 0) await fs.rm(file); // Recover only a positively dead owner.
    }
  }
  fail('IMPORT_LOCKED');
}
export async function discover(context) {
  const page = context.pages()[0] ?? await context.newPage();
  const found = new Map();
  let verified = false, complete = false, upstreamError = false, rateLimited = false;
  const pending = new Set();
  const listener = response => {
    if (!isArticleResponse(response.url())) return;
    const task = (async () => {
      if (response.status() === 429) { rateLimited = true; return; }
      if (!response.ok()) { upstreamError = true; return; }
      const result = parseDiscovery(await response.json());
      verified ||= result.verified; complete ||= result.complete;
      for (const c of result.candidates) found.set(c.articleId, c);
    })().catch(() => { upstreamError = true; });
    pending.add(task); void task.finally(() => pending.delete(task));
  };
  page.on('response', listener);
  try {
    const navigation = await page.goto(`https://x.com/${HANDLE}/articles`, { waitUntil: 'domcontentloaded', timeout: 25000 });
    if (navigation?.status() === 429) fail('RATE_LIMITED');
    // Presence of authenticated navigation, not cookies, is the authorization check.
    try { await page.locator('[data-testid="SideNav_AccountSwitcher_Button"]').waitFor({ timeout: 12000 }); }
    catch { fail(rateLimited ? 'RATE_LIMITED' : 'LOGIN_REQUIRED'); }
    for (let step = 0; step < 15; step++) {
      await page.waitForTimeout(1200);
      await Promise.all([...pending]);
      if (rateLimited) fail('RATE_LIMITED');
      if (verified && complete) break;
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    }
    if (upstreamError) fail('DISCOVERY_UPSTREAM_ERROR');
    if (!verified || !complete) fail('DISCOVERY_UNVERIFIED');
    return [...found.values()];
  } finally { page.off('response', listener); }
}
async function fetchArticle(candidate) {
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const response = await fetch(`https://api.fxtwitter.com/${HANDLE}/status/${candidate.tweetId}`, { signal: AbortSignal.timeout(10000), redirect: 'error' });
      if (response.status === 429) fail('RATE_LIMITED');
      if (!response.ok) fail('BODY_FETCH_FAILED');
      return normalizeArticle(await response.json(), candidate);
    } catch (error) {
      if (attempt || /IDENTITY_MISMATCH|INCOMPLETE_BODY|RATE_LIMITED/.test(error.message)) throw error;
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
}
export async function main(args = process.argv.slice(2)) {
  let browser, context, discoveryAt, lock;
  const dryRun = args.includes('--dry-run'), refreshAuth = args.includes('--refresh-auth');
  await fs.mkdir(STATE, { recursive: true, mode: 0o700 });
  // Hard process deadline also covers hung browser shutdown.
  const deadline = setTimeout(() => {
    void writeStatus(STATUS, { status: 'error', errorCode: 'TIMEOUT', lastSuccessfulDiscoveryAt: discoveryAt, addedCount: 0 }).finally(() => process.exit(1));
    setTimeout(() => process.exit(1), 1500);
  }, 115000);
  try {
    if (args.some(a => !['--dry-run', '--refresh-auth'].includes(a))) fail('INVALID_ARGUMENTS');
    const blocked = await activeBackoff(BACKOFF);
    if (shouldHonorBackoff(blocked, refreshAuth)) fail(blocked);
    lock = await acquireLock(path.join(STATE, 'import.lock'));
    ({ browser, context } = await createAuthenticatedContext());
    const candidates = await discover(context);
    discoveryAt = new Date().toISOString();
    await fs.rm(BACKOFF, { force: true });
    const existing = JSON.parse(await fs.readFile(DATA, 'utf8'));
    const known = new Set(existing.map(a => a.id));
    const fresh = [];
    for (const candidate of candidates) if (!known.has(candidate.articleId)) fresh.push(await fetchArticle(candidate));
    const count = await appendArticles(DATA, fresh, dryRun);
    await writeStatus(STATUS, { status: 'success', errorCode: null, lastSuccessfulDiscoveryAt: discoveryAt, addedCount: dryRun ? 0 : count });
    console.log(JSON.stringify({ status: 'success', dryRun, discoveredCount: candidates.length, addedCount: dryRun ? 0 : count, wouldAddCount: count }));
  } catch (error) {
    const code = safeErrorCode(error?.message);
    await recordBackoff(BACKOFF, code);
    await writeStatus(STATUS, { status: 'error', errorCode: code, lastSuccessfulDiscoveryAt: discoveryAt, addedCount: 0 });
    console.error(`${code}: Import aborted without partial article writes.`);
    process.exitCode = 1;
  } finally {
    await context?.close().catch(() => {});
    await browser?.close().catch(() => {});
    if (lock) { await lock.close(); await fs.rm(path.join(STATE, 'import.lock'), { force: true }); }
    clearTimeout(deadline);
  }
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await main();
