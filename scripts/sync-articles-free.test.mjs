import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
// All upstream payloads in this file are explicitly SYNTHETIC, not recorded X data.
const mod = await import('./sync-articles-free.mjs');

test('recognizes supported X Articles operation naming variants, not other timelines', () => {
  assert.equal(mod.isArticleResponse('https://x.com/i/api/graphql/hash/UserArticlesTweets?variables=x'), true);
  assert.equal(mod.isArticleResponse('https://x.com/i/api/graphql/hash/UserArticles?variables=x'), true);
  assert.equal(mod.isArticleResponse('https://x.com/i/api/graphql/hash/HomeTimeline'), false);
  assert.equal(mod.isArticleResponse('https://evil.example/i/api/graphql/hash/UserArticles'), false);
});
test('recovers only dead-process locks and refuses concurrent importer', async () => {
  const dir = await mkdtemp(path.join(tmpdir(), 'synthetic-lock-')); const file = path.join(dir, 'lock');
  await writeFile(file, '2147483647');
  const lock = await mod.acquireLock(file);
  await assert.rejects(mod.acquireLock(file), /IMPORT_LOCKED/);
  assert.equal(await readFile(file, 'utf8'), String(process.pid));
  await lock.close();
});
test('normalizes image entities without losing inline placement', () => {
  const f = fixture(); const a = f.tweet.article;
  a.media_entities = [{ media_key: 'synthetic-key', media_id: 'synthetic-media', media_url_https: 'https://example.com/synthetic.png', original_info: { width: 800, height: 400 } }];
  a.cover_media = a.media_entities[0];
  a.content.entityMap = [{ key: 0, value: { type: 'MEDIA', data: { mediaItems: [{ mediaId: 'synthetic-media' }] } } }];
  a.content.blocks.push({ type: 'atomic', text: '', entityRanges: [{ key: 0 }] });
  const result = mod.normalizeArticle(f, candidate);
  assert.deepEqual(result.blocks[2], { type: 'image', text: '', imageUrl: 'https://example.com/synthetic.png' });
  assert.equal(result.images[0].type, 'cover'); assert.equal(result.images[1].width, 800);
});
test('authentication backoff persists across runs, expires and does not slide', async () => {
  const dir = await mkdtemp(path.join(tmpdir(), 'synthetic-backoff-')); const file = path.join(dir, 'backoff.json');
  await mod.recordBackoff(file, 'LOGIN_REQUIRED', 1000);
  const original = await readFile(file, 'utf8');
  await mod.recordBackoff(file, 'LOGIN_REQUIRED', 2000);
  assert.equal(await readFile(file, 'utf8'), original);
  assert.equal(await mod.activeBackoff(file, 2000), 'LOGIN_REQUIRED');
  assert.equal(await mod.activeBackoff(file, 1000 + 6 * 60 * 60 * 1000), null);
  await mod.recordBackoff(file, 'RATE_LIMITED', 1000 + 6 * 60 * 60 * 1000);
  assert.equal(await mod.activeBackoff(file, 1001 + 6 * 60 * 60 * 1000), 'RATE_LIMITED');
});
test('refresh auth bypasses only LOGIN_REQUIRED backoff', () => {
  assert.equal(mod.shouldHonorBackoff('LOGIN_REQUIRED', true), false);
  assert.equal(mod.shouldHonorBackoff('LOGIN_REQUIRED', false), true);
  assert.equal(mod.shouldHonorBackoff('RATE_LIMITED', true), true);
  assert.equal(mod.shouldHonorBackoff(null, true), false);
});
const candidate = { tweetId: '1234567890123456789', articleId: '1234567890123456788' };
function fixture() { return { tweet: { id: candidate.tweetId, author: { screen_name: 'monarchreport25' }, article: { id: candidate.articleId, title: 'Synthetic article', created_at: '2026-09-01T00:00:00Z', preview_text: 'Synthetic preview', content: { blocks: [{ type: 'header-two', text: 'Synthetic heading' }, { type: 'unstyled', text: 'Synthetic full body beyond preview.', inlineStyleRanges: [{ style: 'BOLD', offset: 0, length: 9 }] }], entityMap: {} } } } }; }
test('does not resolve missing media keys by comparing undefined values', () => {
  const f = fixture();
  f.tweet.article.media_entities = [{ media_url_https: 'https://example.com/unrelated.png' }];
  f.tweet.article.content.entityMap = { 0: { type: 'MEDIA', data: {} } };
  f.tweet.article.content.blocks.push({ type: 'atomic', text: '', entityRanges: [{ key: 0 }] });
  assert.throws(() => mod.normalizeArticle(f, candidate), /INCOMPLETE_BODY/);
});
test('exports real free importer functions', () => assert.equal(typeof mod.normalizeArticle, 'function'));
test('normalizes structured full body and styles', () => { const a = mod.normalizeArticle(fixture(), candidate); assert.equal(a.id, candidate.articleId); assert.equal(a.blocks[0].level, 2); assert.equal(a.blocks[1].styles[0].style, 'bold'); assert.deepEqual(a.images, []); });
test('rejects wrong author, tweet and article IDs', () => { for (const change of [f => f.tweet.author.screen_name = 'other', f => f.tweet.id = '999', f => f.tweet.article.id = '888']) { const f = fixture(); change(f); assert.throws(() => mod.normalizeArticle(f, candidate), /IDENTITY_MISMATCH/); } });
test('rejects empty, preview-only, truncated and unresolved media bodies', () => { for (const change of [f => f.tweet.article.content.blocks = [], f => f.tweet.article.content.blocks = [{ type: 'unstyled', text: 'Synthetic preview' }], f => f.tweet.article.truncated = true, f => f.tweet.article.content.blocks.push({ type: 'atomic', text: '' })]) { const f = fixture(); change(f); assert.throws(() => mod.normalizeArticle(f, candidate), /INCOMPLETE_BODY/); } });
function timeline() { return { data: { user: { result: { timeline: { timeline: { instructions: [{ type: 'TimelineAddEntries', entries: [{ content: { itemContent: { tweet_results: { result: { rest_id: candidate.tweetId, core: { user_results: { result: { legacy: { screen_name: 'monarchreport25' } } } }, article: { article_results: { result: { rest_id: candidate.articleId } } } } } } } }, { content: { cursorType: 'Bottom', value: '' } }] }] } } } } } }; }
test('discovers article tweet identities and positive terminal marker only', () => { const d = mod.parseDiscovery(timeline()); assert.deepEqual(d.candidates, [candidate]); assert.equal(d.complete, true); assert.equal(mod.parseDiscovery({ data: {} }).verified, false); assert.equal(mod.parseDiscovery({ data: {} }).complete, false); });
test('deduplicates atomically while preserving existing objects; dry-run never writes', async () => { const dir = await mkdtemp(path.join(tmpdir(), 'synthetic-x-')); const file = path.join(dir, 'articles.json'); const old = [{ id: 'old', tweetId: 'old-tweet', arbitrary: { preserved: true } }]; const original = JSON.stringify(old); await writeFile(file, original); const fresh = mod.normalizeArticle(fixture(), candidate); assert.equal(await mod.appendArticles(file, [fresh, fresh], true), 1); assert.equal(await readFile(file, 'utf8'), original); assert.equal(await mod.appendArticles(file, [fresh, fresh], false), 1); assert.deepEqual(JSON.parse(await readFile(file, 'utf8')), [...old, fresh]); assert.equal(await mod.appendArticles(file, [fresh], false), 0); });
test('status errors retain discovery timestamp and redact unknown error values', async () => { const dir = await mkdtemp(path.join(tmpdir(), 'synthetic-status-')); const file = path.join(dir, 'status.json'); await mod.writeStatus(file, { status: 'success', errorCode: null, lastSuccessfulDiscoveryAt: '2026-09-01T00:00:00Z', addedCount: 2 }); await mod.writeStatus(file, { status: 'error', errorCode: 'raw-cookie=synthetic-secret', addedCount: 0 }); assert.deepEqual(JSON.parse(await readFile(file, 'utf8')), { status: 'error', errorCode: 'IMPORT_FAILED', lastSuccessfulDiscoveryAt: '2026-09-01T00:00:00Z', addedCount: 0 }); });
