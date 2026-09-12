# Free X Article sync

```sh
cd /Users/jeongxclaw1/.hermes/profiles/monarch/workspaces/the-monarch-report
npm run test:sync-articles-free
npm run sync-articles-free -- --dry-run
npm run sync-articles-free
# Interactive setup ONLY when the user is ready; never run concurrently with sync:
npm run sync-articles-free -- --login
```

## Scope and safety

- New entry point is `scripts/sync-articles-free.mjs`. It never imports the legacy paid scraper or loads dotenv. Existing paid entry points are unchanged, **not** fallbacks.
- Playwright uses installed Google Chrome on macOS, otherwise its installed Chromium. No automatic browser download. Dedicated persistent profile: `~/.hermes/profiles/monarch/state/x-article-sync/browser`. Never reads/copies other browser stores or prints cookies.
- Browser navigates only to `https://x.com/monarchreport25/articles` for discovery. It observes the page's own `UserArticles` / `UserArticlesTweets` GraphQL responses, verifies authenticated account navigation, and follows bounded scrolling. No independently constructed authenticated API calls.
- Discovery succeeds only with recognized timeline instructions plus an explicit bottom termination marker. Missing/changed response shape, pagination cap, rate limit or login wall fails closed rather than reporting no-new. X endpoint/schema changes may require adapting the parser after an authorized session is available.
- Full structured article content comes from the free public FxTwitter endpoint. Tweet ID, article ID and author must match. Empty, preview-only, flagged-truncated, invalid-date and unsupported/unresolved embed bodies are rejected. When upstream supplies `plain_text`, text must match all blocks. No DOM preview is accepted as body. This validates upstream's structured content; it cannot independently prove upstream did not omit content without indicating truncation.
- Existing JSON objects/order are preserved; new articles are deduplicated by article/tweet ID and appended in a same-directory atomic rename only after **all** candidates validate. A failed body aborts the whole batch. Normal run has a hard 115-second deadline plus at most 1.5 seconds for final status; body requests have 10-second timeouts and at most two attempts. HTTP 429 is never retried.
- Importer-owned PID lock prevents concurrent importer writes; dead PID locks are recoverable. Do not edit articles.json concurrently from other tools. Browser also enforces a profile lock.
- `--dry-run` fetches/validates but never writes articles.json. It reports `wouldAddCount`, while status `addedCount` remains zero. It DOES update operational status/browser session state.

## Operational status and cooldown

`~/.hermes/profiles/monarch/state/x-article-sync/import-status.json`:

```json
{"status":"error","errorCode":"LOGIN_REQUIRED","lastSuccessfulDiscoveryAt":null,"addedCount":0}
```

Errors preserve the previous successful discovery timestamp; a successful discovery followed by body failure records the current discovery timestamp. Exit code is nonzero for any failure. A success means discovery and all candidate validations completed, not that deployment occurred.

`auth-backoff.json` in the same state directory persists a six-hour backoff for `LOGIN_REQUIRED` / `RATE_LIMITED`. Subsequent normal/dry runs return the same error without opening a browser or contacting X; checks do not extend the backoff. Interactive `--login` intentionally bypasses it, and clears it when that browser context closes. Never automate `--login`. If X says to wait, preserve the session and stop interaction; resume only when the user says ready. The parent scheduler must remain disabled pending a successful authorized live dry-run and review. No push, deployment or cron is performed here.

## Verification and remaining gate

All test upstream payloads are explicitly synthetic. Offline tests exercise normalization, identity failures, body/media rejection, verified/failed discovery boundaries, deduplication, atomic writes, status preservation, locking, persisted backoff and a real CLI subprocess under synthetic HOME (no browser/network).

The first real dry-run reached X and returned `LOGIN_REQUIRED`; article data remained unchanged. The dedicated login browser was opened. User reported X login cooldown, so further live attempts were stopped; parent now owns the login process. **Successful authenticated discovery/body import is not yet live-verified.** Do not interpret synthetic tests as evidence that the current X response schema is confirmed.

Scoped audit at setup: 13 findings (1 critical, 8 high, 2 moderate, 2 low), including direct Next.js and its ecosystem/tooling. Playwright and playwright-core were not listed by this audit. No unrelated upgrades applied; review production Next.js exposure separately before deployment.
