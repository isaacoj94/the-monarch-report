// Explicitly SYNTHETIC inline cookie exports; no real cookie values or browser profiles are accessed.
import test from 'node:test';
import assert from 'node:assert/strict';
import { chmod, mkdtemp, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import * as mod from './sync-articles-free.mjs';

const syntheticValue = 'synthetic-cookie-value-that-must-be-redacted';
const cookie = (name, domain = 'x.com') => ({
  name,
  value: `${syntheticValue}-${name}`,
  domain,
  path: '/',
  expires: 1999999999,
  httpOnly: name === 'auth_token',
  secure: true,
  sameSite: 'Lax',
  hostOnly: domain === 'x.com',
  source: 'chrome',
});
const validExport = () => ({ cookies: [cookie('ct0'), cookie('auth_token')] });

async function fixture(payload = validExport(), mode = 0o600) {
  const dir = await mkdtemp(path.join(tmpdir(), 'synthetic-x-auth-'));
  const file = path.join(dir, 'approved.json');
  await writeFile(file, JSON.stringify(payload), { mode });
  await chmod(file, mode);
  return { file, expectedPath: file };
}

test('loads exactly auth_token and ct0 into minimal Playwright cookies', async () => {
  const options = await fixture();
  const cookies = await mod.loadApprovedAuthCookies(options);
  assert.deepEqual(cookies, [
    { name: 'ct0', value: `${syntheticValue}-ct0`, domain: 'x.com', path: '/', secure: true, httpOnly: false, sameSite: 'Lax', expires: 1999999999 },
    { name: 'auth_token', value: `${syntheticValue}-auth_token`, domain: 'x.com', path: '/', secure: true, httpOnly: true, sameSite: 'Lax', expires: 1999999999 },
  ]);
});

test('rejects a non-absolute or non-exact auth file path', async () => {
  const options = await fixture();
  await assert.rejects(mod.loadApprovedAuthCookies({ file: 'relative.json', expectedPath: options.expectedPath }), /AUTH_COOKIE_ACCESS_FAILED/);
  await assert.rejects(mod.loadApprovedAuthCookies({ file: `${options.file}.other`, expectedPath: options.expectedPath }), /AUTH_COOKIE_ACCESS_FAILED/);
});

test('rejects auth files with any group or other permission bits', async () => {
  const options = await fixture(validExport(), 0o640);
  await assert.rejects(mod.loadApprovedAuthCookies(options), /AUTH_COOKIE_ACCESS_FAILED/);
});

test('rejects a symlink even when its target is a locked regular file', async () => {
  const options = await fixture();
  const link = `${options.file}.link`;
  await symlink(options.file, link);
  await assert.rejects(mod.loadApprovedAuthCookies({ file: link, expectedPath: link }), /AUTH_COOKIE_ACCESS_FAILED/);
});

test('rejects an oversized auth file before parsing it', async () => {
  const options = await fixture({ cookies: [], padding: 'x'.repeat(mod.MAX_AUTH_FILE_BYTES) });
  await assert.rejects(mod.loadApprovedAuthCookies(options), /AUTH_COOKIE_ACCESS_FAILED/);
});

test('rejects malformed, extra, duplicate, empty, or wrong-domain cookies with redacted errors', async () => {
  const payloads = [
    [],
    { cookies: [cookie('ct0')] },
    { cookies: [cookie('ct0'), cookie('ct0')] },
    { cookies: [cookie('ct0'), cookie('auth_token'), cookie('extra')] },
    { cookies: [cookie('ct0'), { ...cookie('auth_token'), value: '' }] },
    { cookies: [cookie('ct0'), cookie('auth_token', 'twitter.com')] },
    { cookies: [cookie('ct0'), cookie('auth_token')], extra: true },
    { cookies: [{ ...cookie('ct0'), surprise: true }, cookie('auth_token')] },
  ];
  for (const payload of payloads) {
    const options = await fixture(payload);
    await assert.rejects(mod.loadApprovedAuthCookies(options), error => {
      assert.equal(error.message, 'AUTH_COOKIE_ACCESS_FAILED');
      assert.equal(String(error).includes(syntheticValue), false);
      return true;
    });
  }
});
