// Explicitly SYNTHETIC Chrome cookie databases; no real browser profile or network is accessed.
import test from 'node:test';
import assert from 'node:assert/strict';
import { spawn, spawnSync } from 'node:child_process';
import { access, chmod, lstat, mkdtemp, mkdir, readFile, readdir, rename, rm, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import * as mod from './sync-articles-free.mjs';

const sqlite = '/usr/bin/sqlite3';

async function makeChromeRoot({ wal = false } = {}) {
  const root = await mkdtemp(path.join(tmpdir(), 'synthetic-chrome-'));
  await chmod(root, 0o700);
  await writeFile(path.join(root, 'Local State'), '{"os_crypt":{"synthetic":true}}', { mode: 0o600 });
  const network = path.join(root, 'Profile 4', 'Network');
  await mkdir(network, { recursive: true, mode: 0o700 });
  const db = path.join(network, 'Cookies');
  if (!wal) {
    const result = spawnSync(sqlite, [db, "CREATE TABLE cookies(host_key TEXT NOT NULL, name TEXT, value TEXT, encrypted_value BLOB); INSERT INTO cookies VALUES('x.com','a','secret-a',X'01'),('.x.com','b','secret-b',X'02'),('example.com','c','must-not-stage',X'03');"], { encoding: 'utf8' });
    assert.equal(result.status, 0, result.stderr);
    return { root, db };
  }
  const script = [
    'import sqlite3,sys',
    'db=sqlite3.connect(sys.argv[1])',
    "db.execute('PRAGMA journal_mode=WAL')",
    "db.execute('PRAGMA wal_autocheckpoint=0')",
    "db.execute('CREATE TABLE cookies(host_key TEXT NOT NULL, name TEXT, value TEXT, encrypted_value BLOB)')",
    "db.execute(\"INSERT INTO cookies VALUES('x.com','a','secret-a',X'01')\")",
    "db.execute(\"INSERT INTO cookies VALUES('.x.com','b','secret-b',X'02')\")",
    "db.execute(\"INSERT INTO cookies VALUES('example.com','c','must-not-stage',X'03')\")",
    'db.commit()',
    "print('READY', flush=True)",
    'sys.stdin.read(1)',
  ].join(';');
  const holder = spawn('/usr/bin/python3', ['-c', script, db], { stdio: ['pipe', 'pipe', 'pipe'] });
  await new Promise((resolve, reject) => {
    let output = '';
    holder.stdout.on('data', chunk => { output += chunk; if (output.includes('READY')) resolve(); });
    holder.once('error', reject);
    holder.once('exit', code => { if (!output.includes('READY')) reject(new Error(`fixture exited ${code}`)); });
  });
  return { root, db, holder };
}

async function closeHolder(holder) {
  if (!holder) return;
  holder.stdin.end('x');
  await new Promise(resolve => holder.once('exit', resolve));
}

function sqliteRows(db, sql) {
  const result = spawnSync(sqlite, ['-batch', '-noheader', db, sql], { encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
  return result.stdout.trim().split('\n').filter(Boolean);
}

test('stages a WAL-consistent minimal Profile 4 containing only exact x.com cookie hosts', async () => {
  const source = await makeChromeRoot({ wal: true });
  const stagingRoot = await mkdtemp(path.join(tmpdir(), 'synthetic-stage-parent-'));
  let staged;
  try {
    staged = await mod.stageChromeProfile4({ chromeUserDataDir: source.root, stagingRoot });
    assert.deepEqual(sqliteRows(staged.cookieDb, 'SELECT host_key || ":" || count(*) FROM cookies GROUP BY host_key ORDER BY host_key;'), ['.x.com:1', 'x.com:1']);
    assert.equal(await readFile(path.join(staged.userDataDir, 'Local State'), 'utf8'), '{"os_crypt":{"synthetic":true}}');
    assert.deepEqual(await readdir(staged.userDataDir), ['Local State', 'Profile 4']);
    assert.deepEqual(await readdir(path.join(staged.userDataDir, 'Profile 4')), ['Network']);
    assert.deepEqual(await readdir(path.join(staged.userDataDir, 'Profile 4', 'Network')), ['Cookies']);
    assert.equal((await lstat(staged.userDataDir)).mode & 0o777, 0o700);
    assert.equal((await lstat(staged.cookieDb)).mode & 0o777, 0o600);
    await staged.cleanup();
    await assert.rejects(access(staged.userDataDir), error => error.code === 'ENOENT');
  } finally {
    await staged?.cleanup();
    await closeHolder(source.holder);
    await rm(source.root, { recursive: true, force: true });
    await rm(stagingRoot, { recursive: true, force: true });
  }
});

test('supports Chrome 153 legacy Profile 4/Cookies layout without reading another profile', async () => {
  const source = await makeChromeRoot();
  const stagingRoot = await mkdtemp(path.join(tmpdir(), 'synthetic-stage-parent-'));
  const legacyDb = path.join(source.root, 'Profile 4', 'Cookies');
  await rename(source.db, legacyDb);
  await rm(path.join(source.root, 'Profile 4', 'Network'), { recursive: true });
  let staged;
  try {
    staged = await mod.stageChromeProfile4({ chromeUserDataDir: source.root, stagingRoot });
    assert.equal(staged.cookieDb, path.join(staged.userDataDir, 'Profile 4', 'Cookies'));
    assert.deepEqual(sqliteRows(staged.cookieDb, 'SELECT host_key || ":" || count(*) FROM cookies GROUP BY host_key ORDER BY host_key;'), ['.x.com:1', 'x.com:1']);
    assert.deepEqual(await readdir(path.join(staged.userDataDir, 'Profile 4')), ['Cookies']);
  } finally {
    await staged?.cleanup();
    await rm(source.root, { recursive: true, force: true });
    await rm(stagingRoot, { recursive: true, force: true });
  }
});

test('rejects a symlinked Local State and leaves no staged database behind', async () => {
  const source = await makeChromeRoot();
  const stagingRoot = await mkdtemp(path.join(tmpdir(), 'synthetic-stage-parent-'));
  const realLocalState = path.join(source.root, 'Local State.real');
  await writeFile(realLocalState, '{}', { mode: 0o600 });
  await rm(path.join(source.root, 'Local State'));
  await symlink(realLocalState, path.join(source.root, 'Local State'));
  try {
    await assert.rejects(mod.stageChromeProfile4({ chromeUserDataDir: source.root, stagingRoot }), error => error.message === 'AUTH_COOKIE_ACCESS_FAILED');
    assert.deepEqual(await readdir(stagingRoot), []);
  } finally {
    await rm(source.root, { recursive: true, force: true });
    await rm(stagingRoot, { recursive: true, force: true });
  }
});

test('persistent Chrome launch failures are redacted and always clean the staged profile', async () => {
  const stageParent = await mkdtemp(path.join(tmpdir(), 'synthetic-launch-stage-'));
  const userDataDir = path.join(stageParent, 'run');
  await mkdir(path.join(userDataDir, 'Profile 4', 'Network'), { recursive: true });
  await writeFile(path.join(userDataDir, 'Profile 4', 'Network', 'Cookies'), 'synthetic-secret');
  let cleaned = false;
  await assert.rejects(
    mod.createAuthenticatedContext({
      chromiumApi: { launchPersistentContext: async () => { throw new Error('synthetic-secret-from-chrome'); } },
      profileStager: async () => ({ userDataDir, cleanup: async () => { cleaned = true; await rm(userDataDir, { recursive: true, force: true }); } }),
      headless: true,
    }),
    error => error.message === 'AUTH_COOKIE_ACCESS_FAILED',
  );
  assert.equal(cleaned, true);
  await assert.rejects(access(userDataDir), error => error.code === 'ENOENT');
  await rm(stageParent, { recursive: true, force: true });
});
