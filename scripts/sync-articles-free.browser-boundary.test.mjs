// Explicitly SYNTHETIC Playwright I/O boundaries; no browser or external network is started.
import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { discover, recordBackoff, writeStatus } from './sync-articles-free.mjs';

function context({ auth = true, status = 200, payload = {}, emit = true } = {}) {
  let listener;
  const page = {
    on: (_event, fn) => { listener = fn; }, off: () => {},
    goto: async () => {
      if (emit) listener({ url: () => 'https://x.com/i/api/graphql/synthetic/UserArticlesTweets', status: () => status, ok: () => status === 200, json: async () => payload });
      return { status: () => status };
    },
    locator: () => ({ waitFor: async () => { if (!auth) throw new Error('synthetic missing authenticated navigation'); } }),
    waitForTimeout: async () => {}, evaluate: async () => {},
  };
  return { pages: () => [page] };
}
const emptyVerified = { data: { user: { result: { timeline: { timeline: { instructions: [{ type: 'TimelineTerminateTimeline', direction: 'Bottom' }] } } } } } };
test('no authorized navigation fails explicitly, never empty success', async () => {
  await assert.rejects(discover(context({ auth: false, payload: emptyVerified })), /LOGIN_REQUIRED/);
});
test('unverified discovery cannot report no-new', async () => {
  await assert.rejects(discover(context()), /DISCOVERY_UNVERIFIED/);
});
test('positively terminated Articles timeline permits empty discovery', async () => {
  assert.deepEqual(await discover(context({ payload: emptyVerified })), []);
});
test('rate limit is explicit even without authenticated navigation', async () => {
  await assert.rejects(discover(context({ status: 429, auth: false })), /RATE_LIMITED/);
});
test('CLI honors persisted backoff without launching browser or changing discovery timestamp', async () => {
  const home = await mkdtemp(path.join(tmpdir(), 'synthetic-cli-'));
  const state = path.join(home, '.hermes/profiles/monarch/state/x-article-sync');
  await recordBackoff(path.join(state, 'auth-backoff.json'), 'RATE_LIMITED');
  await writeStatus(path.join(state, 'import-status.json'), { status: 'success', errorCode: null, lastSuccessfulDiscoveryAt: '2026-09-01T00:00:00Z', addedCount: 0 });
  const result = spawnSync(process.execPath, [new URL('./sync-articles-free.mjs', import.meta.url).pathname, '--dry-run'], { env: { HOME: home }, encoding: 'utf8', timeout: 5000 });
  assert.equal(result.status, 1); assert.match(result.stderr, /RATE_LIMITED/);
  assert.deepEqual(JSON.parse(await readFile(path.join(state, 'import-status.json'), 'utf8')), { status: 'error', errorCode: 'RATE_LIMITED', lastSuccessfulDiscoveryAt: '2026-09-01T00:00:00Z', addedCount: 0 });
});
