// Explicitly SYNTHETIC Playwright I/O boundaries; no browser or external network is started.
import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { AUTH_PROFILE_DIRECTORY, AUTH_PROFILE_LABEL, createAuthenticatedContext, discover, recordBackoff, writeStatus } from './sync-articles-free.mjs';

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
test('authentication launches isolated nonpersistent installed Chrome and adds only approved cookies', async () => {
  assert.equal(AUTH_PROFILE_DIRECTORY, 'Profile 4');
  assert.equal(AUTH_PROFILE_LABEL, 'Yoo Suk');
  const calls = [];
  const approved = [
    { name: 'ct0', value: 'synthetic-ct0', domain: 'x.com', path: '/', secure: true },
    { name: 'auth_token', value: 'synthetic-auth', domain: '.x.com', path: '/', secure: true },
  ];
  const contextApi = { addCookies: async cookies => calls.push(['addCookies', cookies]), close: async () => calls.push(['context.close']) };
  const browserApi = { newContext: async options => { calls.push(['newContext', options]); return contextApi; }, close: async () => calls.push(['browser.close']) };
  const chromiumApi = {
    launch: async options => { calls.push(['launch', options]); return browserApi; },
    launchPersistentContext: async () => { throw new Error('persistent launch is forbidden'); },
  };
  const result = await createAuthenticatedContext({ chromiumApi, cookieLoader: async () => approved, headless: true });
  assert.equal(result.browser, browserApi);
  assert.equal(result.context, contextApi);
  assert.deepEqual(calls, [
    ['launch', { headless: true, channel: 'chrome', timeout: 15000 }],
    ['newContext', {}],
    ['addCookies', approved],
  ]);
});
test('authentication failures close partial resources and expose only a stable redacted code', async () => {
  const calls = [];
  const contextApi = { addCookies: async () => { throw new Error('synthetic-secret-cookie-value'); }, close: async () => calls.push('context') };
  const browserApi = { newContext: async () => contextApi, close: async () => calls.push('browser') };
  await assert.rejects(
    createAuthenticatedContext({
      chromiumApi: { launch: async () => browserApi },
      cookieLoader: async () => [{ name: 'ct0', value: 'synthetic-secret-cookie-value' }],
    }),
    error => error.message === 'AUTH_COOKIE_ACCESS_FAILED' && !String(error).includes('synthetic-secret-cookie-value'),
  );
  assert.deepEqual(calls, ['context', 'browser']);
});
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
