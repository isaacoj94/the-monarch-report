/**
 * Desk collector. Runs only from GitHub Actions or a local CLI.
 * Never import this from a Next.js route — Vercel cold starts must not spend credits.
 *
 * Collector A: official X API + since_id (no LLM tokens).
 * Collector B: one OpenRouter Grok beat with native X search, hard cost caps.
 * Nothing is published. Items land in src/data/desk/inbox.json as drafts.
 */
import { createHash } from 'node:crypto';
import { isoDaysAgo, LOOKBACK_DAYS, MAX_DISCOVERY_ITEMS, MAX_GROK_CALLS_PER_RUN, dailyBudgetUsd } from '../src/lib/desk/cost';
import { openRouterChat, parseDiscovery } from '../src/lib/desk/openrouter';
import { requiresHumanApproval } from '../src/lib/desk/rules';
import {
  charge,
  loadCursor,
  loadInbox,
  loadWatchlist,
  rememberPost,
  saveCursor,
  saveInbox,
} from '../src/lib/desk/store';
import type { DeskClaim, DeskEvent, DiscoveryItem, RawItem } from '../src/lib/desk/types';
import { fetchOwnPosts, hasXCredentials } from '../src/lib/desk/x-api';

const args = new Set(process.argv.slice(2));
const DRY = args.has('--dry-run');
const VERIFY = args.has('--verify') || process.env.DESK_VERIFY === '1';

function log(message: string) {
  console.log(`[collect-x] ${message}`);
}

function hashText(value: string): string {
  return createHash('sha1').update(value).digest('hex').slice(0, 16);
}

function postIdFrom(item: DiscoveryItem): string | undefined {
  if (item.postId && /^\d{8,}$/.test(item.postId)) return item.postId;
  const match = item.url?.match(/status\/(\d{8,})/);
  return match?.[1];
}

function toRaw(item: DiscoveryItem, beat: string, collector: RawItem['collector']): RawItem {
  const postId = postIdFrom(item);
  const text = item.text || item.title;
  return {
    id: `raw_${postId || hashText(`${beat}:${item.url || item.title}`)}`,
    collectedAt: new Date().toISOString(),
    collector,
    beat,
    postId,
    url: item.url,
    handle: item.handle,
    postedAt: item.eventTime,
    text,
    hasArticle: /\/article\//i.test(item.url || '') || /x article/i.test(text),
    reviewState: 'inbox',
    seenHash: hashText(text),
  };
}

function toEvent(item: DiscoveryItem, raw: RawItem, claimIds: string[]): DeskEvent {
  const needsHuman = requiresHumanApproval(`${item.title} ${item.claims.join(' ')}`);
  return {
    id: `evt_${raw.id.replace(/^raw_/, '')}`,
    title: item.title || raw.text.slice(0, 140),
    summary: (item.text || item.claims[0] || raw.text).slice(0, 400),
    status: 'Developing',
    reviewState: needsHuman ? 'needs_review' : 'inbox',
    urgency: item.urgency,
    location: item.location,
    eventTime: item.eventTime,
    people: item.people,
    organizations: item.organizations,
    individualImpact: item.individualImpact,
    companyImpact: item.companyImpact,
    impactTags: [],
    unverified: item.uncertainties,
    counterclaims: item.counterclaims,
    sourceUrls: [item.url, ...item.primarySourceCandidates].filter(Boolean) as string[],
    postIds: raw.postId ? [raw.postId] : [],
    rawItemIds: [raw.id],
    claimIds,
    lastCheckedAt: new Date().toISOString(),
    extractionModel: process.env.DESK_MODEL,
    extraction: item,
  };
}

async function collectOwnAccount() {
  const watchlist = loadWatchlist();
  if (!hasXCredentials()) {
    log('Collector A skipped: no X_BEARER_TOKEN (preferred — $0 LLM).');
    return { added: 0, newestId: null as string | null };
  }
  const cursor = loadCursor();
  const inbox = loadInbox();
  const result = await fetchOwnPosts({
    username: watchlist.ownHandle,
    sinceId: cursor.ownAccountSinceId,
    maxResults: 20,
  });
  let added = 0;
  for (const post of result.posts) {
    if (!rememberPost(cursor, post.id)) continue;
    const raw: RawItem = {
      id: `raw_${post.id}`,
      collectedAt: new Date().toISOString(),
      collector: 'x-api',
      beat: 'own-account',
      postId: post.id,
      url: `https://x.com/${watchlist.ownHandle}/status/${post.id}`,
      handle: watchlist.ownHandle,
      postedAt: post.created_at,
      lang: post.lang,
      text: post.text,
      hasArticle: Boolean(post.article),
      reviewState: 'inbox',
      seenHash: hashText(post.text),
    };
    if (!inbox.rawItems.some((row) => row.id === raw.id)) {
      inbox.rawItems.unshift(raw);
      added += 1;
    }
  }
  cursor.ownAccountSinceId = result.newestId ?? cursor.ownAccountSinceId;
  saveInbox(inbox);
  saveCursor(cursor);
  log(`Collector A: ${result.posts.length} posts, ${added} new, since_id=${cursor.ownAccountSinceId}`);
  return { added, newestId: cursor.ownAccountSinceId };
}

const DISCOVERY_SYSTEM = `You search X only. Do not search the open web. Do not analyze images or video.
Return JSON {"items":[...]} with at most ${MAX_DISCOVERY_ITEMS} new posts.
Each item: title, url, postId, handle, eventTime, location, people[], organizations[], claims[], primarySourceCandidates[], individualImpact, companyImpact, counterclaims, uncertainties, urgency, text.
If nothing new, return {"items":[]}. No prose.`;

async function collectBeat() {
  if (!process.env.OPENROUTER_API_KEY) {
    log('Collector B skipped: no OPENROUTER_API_KEY.');
    return { added: 0, beat: null as string | null, cost: 0 };
  }

  const cursor = loadCursor();
  const budget = dailyBudgetUsd();
  if (cursor.spendUsd >= budget) {
    log(`Collector B skipped: daily budget $${budget} already spent ($${cursor.spendUsd.toFixed(3)}).`);
    return { added: 0, beat: null, cost: 0 };
  }

  const watchlist = loadWatchlist();
  const beats = watchlist.beats.filter((b) => b.handles.length > 0);
  if (!beats.length) {
    log('Collector B skipped: empty watchlist.');
    return { added: 0, beat: null, cost: 0 };
  }

  const beat = beats[cursor.lastBeatIndex % beats.length];
  const handles = beat.handles.slice(0, 20);
  const fromDate = isoDaysAgo(LOOKBACK_DAYS);
  log(`Collector B beat=${beat.id} handles=${handles.length} from=${fromDate}`);

  if (DRY) {
    cursor.lastBeatIndex = (cursor.lastBeatIndex + 1) % beats.length;
    saveCursor(cursor);
    return { added: 0, beat: beat.id, cost: 0 };
  }

  const { content, cost } = await openRouterChat({
    messages: [
      { role: 'system', content: DISCOVERY_SYSTEM },
      {
        role: 'user',
        content: `${beat.query}\nLook back from ${fromDate} only.\nHandles: ${handles.map((h) => `@${h}`).join(' ')}`,
      },
    ],
    xSearch: {
      allowed_x_handles: handles,
      from_date: fromDate,
      enable_image_understanding: false,
      enable_video_understanding: false,
    },
  });

  charge(cursor, cost.estimatedUsd);
  log(
    `OpenRouter ${cost.model} tokens=${cost.promptTokens}+${cost.completionTokens} searches=${cost.searchRequests} ~$${cost.estimatedUsd.toFixed(4)} day=$${cursor.spendUsd.toFixed(4)}`,
  );

  let parsed;
  try {
    parsed = parseDiscovery(content);
  } catch (error) {
    cursor.lastError = `JSON parse failed for ${beat.id}: ${(error as Error).message}`;
    cursor.lastBeatIndex = (cursor.lastBeatIndex + 1) % beats.length;
    cursor.lastRunAt = new Date().toISOString();
    saveCursor(cursor);
    log(cursor.lastError);
    return { added: 0, beat: beat.id, cost: cost.estimatedUsd };
  }

  const inbox = loadInbox();
  let added = 0;
  for (const item of parsed.items) {
    const postId = postIdFrom(item);
    if (postId && !rememberPost(cursor, postId)) continue;
    const raw = toRaw(item, beat.id, 'openrouter-x');
    if (inbox.rawItems.some((row) => row.id === raw.id || (postId && row.postId === postId))) continue;
    const claims: DeskClaim[] = item.claims.slice(0, 6).map((text, index) => ({
      id: `clm_${raw.id}_${index}`,
      text,
      kind: requiresHumanApproval(text) ? 'allegation' : 'fact',
      verdict: 'unchecked',
      needsHuman: true,
      sources: [item.url].filter(Boolean) as string[],
    }));
    claims.forEach((claim) => inbox.claims.unshift(claim));
    const event = toEvent(
      item,
      raw,
      claims.map((c) => c.id),
    );
    inbox.rawItems.unshift(raw);
    if (!inbox.events.some((row) => row.id === event.id)) inbox.events.unshift(event);
    added += 1;
  }

  cursor.lastBeatIndex = (cursor.lastBeatIndex + 1) % beats.length;
  cursor.lastRunAt = new Date().toISOString();
  cursor.lastError = null;
  saveInbox(inbox);
  saveCursor(cursor);
  log(`Collector B: ${parsed.items.length} returned, ${added} new`);
  return { added, beat: beat.id, cost: cost.estimatedUsd };
}

const CHALLENGE_SYSTEM = `You are an independent verifier. You did not write the candidate notes.
Try to disprove each claim. Find the strongest opposing account. Trace summaries to an original source.
Detect circular sourcing. Compare Korean wording with English coverage when relevant.
Separate fact, allegation, inference, and opinion.
Return JSON {"claims":[{id,verdict,reason,opposingAccount,missingContext}]}
verdict must be supported|partially_supported|contested|unsupported|outdated.
Do not approve publication.`;

async function challengePass() {
  if (!VERIFY) {
    log('Challenge pass skipped (enable with --verify).');
    return 0;
  }
  if (!process.env.OPENROUTER_API_KEY) return 0;

  const cursor = loadCursor();
  const budget = dailyBudgetUsd();
  if (cursor.spendUsd >= budget) {
    log('Challenge pass skipped: daily budget exhausted.');
    return 0;
  }

  const inbox = loadInbox();
  const pending = inbox.events.filter((event) => !event.challenge && event.claimIds.length).slice(0, 1);
  if (!pending.length) {
    log('Challenge pass: nothing new.');
    return 0;
  }

  const event = pending[0];
  const claims = inbox.claims.filter((claim) => event.claimIds.includes(claim.id));
  const { content, cost } = await openRouterChat({
    messages: [
      { role: 'system', content: CHALLENGE_SYSTEM },
      {
        role: 'user',
        content: JSON.stringify({
          title: event.title,
          summary: event.summary,
          sources: event.sourceUrls,
          claims: claims.map((c) => ({ id: c.id, text: c.text })),
        }),
      },
    ],
    enableSearch: true,
    xSearch: {
      from_date: isoDaysAgo(LOOKBACK_DAYS + 5),
      enable_image_understanding: false,
      enable_video_understanding: false,
    },
  });

  charge(cursor, cost.estimatedUsd);
  try {
    event.challenge = JSON.parse(content);
  } catch {
    event.challenge = { raw: content.slice(0, 4000) };
  }
  event.challengeModel = cost.model;
  event.lastCheckedAt = new Date().toISOString();
  saveInbox(inbox);
  saveCursor(cursor);
  log(`Challenge pass on ${event.id} ~$${cost.estimatedUsd.toFixed(4)}`);
  return 1;
}

async function main() {
  log(`start dry=${DRY} verify=${VERIFY} budget=$${dailyBudgetUsd()}`);
  if (DRY) log('Dry run: no OpenRouter/X calls.');

  const own = DRY ? { added: 0, newestId: null } : await collectOwnAccount();
  const discovery = await collectBeat();
  const challenged = DRY ? 0 : await challengePass();

  const cursor = loadCursor();
  cursor.lastRunAt = new Date().toISOString();
  saveCursor(cursor);

  const grokCalls = (discovery.cost > 0 ? 1 : 0) + (challenged ? 1 : 0);
  if (grokCalls > MAX_GROK_CALLS_PER_RUN) {
    log(`warning: grok calls ${grokCalls} exceeded cap ${MAX_GROK_CALLS_PER_RUN}`);
  }

  log(
    `done own+${own.added} beat=${discovery.beat ?? 'none'}+${discovery.added} challenged=${challenged} spendToday=$${cursor.spendUsd.toFixed(4)}`,
  );
}

main().catch((error) => {
  const cursor = loadCursor();
  cursor.lastError = (error as Error).message;
  cursor.lastRunAt = new Date().toISOString();
  saveCursor(cursor);
  console.error(`[collect-x] FAILED: ${(error as Error).message}`);
  process.exit(1);
});
