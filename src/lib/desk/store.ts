import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import type { DeskCursor, DeskInbox, DeskSource, WatchlistFile } from './types';
import { utcDay } from './cost';

const DATA = join(process.cwd(), 'src/data/desk');

export const PATHS = {
  inbox: join(DATA, 'inbox.json'),
  cursor: join(DATA, 'cursor.json'),
  watchlist: join(DATA, 'watchlist.json'),
  sources: join(DATA, 'sources.json'),
};

const EMPTY_INBOX: DeskInbox = { version: 1, rawItems: [], events: [], claims: [] };

const EMPTY_CURSOR: DeskCursor = {
  ownAccountSinceId: null,
  lastRunAt: null,
  lastBeatIndex: 0,
  spendDay: utcDay(),
  spendUsd: 0,
  seenPostIds: [],
  lastError: null,
};

function readJson<T>(path: string, fallback: T): T {
  if (!existsSync(path)) return fallback;
  return JSON.parse(readFileSync(path, 'utf8')) as T;
}

export function loadInbox(): DeskInbox {
  const inbox = readJson(PATHS.inbox, EMPTY_INBOX);
  inbox.rawItems ??= [];
  inbox.events ??= [];
  inbox.claims ??= [];
  return inbox;
}

export function loadCursor(): DeskCursor {
  const cursor = readJson(PATHS.cursor, EMPTY_CURSOR);
  if (cursor.spendDay !== utcDay()) {
    cursor.spendDay = utcDay();
    cursor.spendUsd = 0;
  }
  cursor.seenPostIds ??= [];
  return cursor;
}

export function loadWatchlist(): WatchlistFile {
  return readJson(PATHS.watchlist, {
    ownHandle: 'monarchreport25',
    beats: [],
  });
}

export function loadSources(): DeskSource[] {
  return readJson(PATHS.sources, []);
}

export function writeJson(path: string, value: unknown) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`);
}

export function saveInbox(inbox: DeskInbox) {
  inbox.rawItems = inbox.rawItems.slice(0, 300);
  inbox.events = inbox.events.slice(0, 150);
  inbox.claims = inbox.claims.slice(0, 400);
  writeJson(PATHS.inbox, inbox);
}

export function saveCursor(cursor: DeskCursor) {
  cursor.seenPostIds = cursor.seenPostIds.slice(0, 2000);
  writeJson(PATHS.cursor, cursor);
}

export function rememberPost(cursor: DeskCursor, postId: string): boolean {
  if (!postId || cursor.seenPostIds.includes(postId)) return false;
  cursor.seenPostIds.unshift(postId);
  return true;
}

export function charge(cursor: DeskCursor, usd: number) {
  if (cursor.spendDay !== utcDay()) {
    cursor.spendDay = utcDay();
    cursor.spendUsd = 0;
  }
  cursor.spendUsd = Number((cursor.spendUsd + usd).toFixed(6));
}
