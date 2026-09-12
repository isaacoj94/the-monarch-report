# Free X Article sync

```sh
cd /Users/jeongxclaw1/.hermes/profiles/monarch/workspaces/the-monarch-report
npm run test:sync-articles-free
npm run sync-articles-free -- --dry-run
# Explicitly retry Profile 4 authentication despite an active LOGIN_REQUIRED cooldown:
npm run sync-articles-free -- --dry-run --refresh-auth
npm run sync-articles-free
```

## Scope and safety

- New entry point is `scripts/sync-articles-free.mjs`. It never imports the legacy paid scraper or loads dotenv. Existing paid entry points are unchanged, **not** fallbacks.
- Authentication uses only the installed Google Chrome and the exact **Profile 4** directory (public label **Yoo Suk**). It does not use a JS cookie reader, decrypt cookies directly, request another browser/profile, or use a paid fallback.
- Before Chrome starts, the importer creates an unpredictable `chrome-profile-*` directory under `~/.hermes/profiles/monarch/state/x-article-sync` (state root and run directory mode `0700`). It copies only Chrome's owned, non-symlink `Local State` plus a SQLite-consistent backup of the owned, non-symlink Profile 4 cookie database. The preferred source is `Profile 4/Network/Cookies`; Chrome 153 on this Mac uses the legacy `Profile 4/Cookies` location, which is the only other accepted source. No directory scan or other profile is used.
- `scripts/stage-x-cookies.py` uses Python's stdlib SQLite backup API, which includes committed source WAL state, then immediately deletes every row except exact `host_key` `x.com` or `.x.com`, switches the staged database out of WAL mode, and vacuums it. It never selects or prints cookie names, values, or encrypted values. The staged database and copied Local State are mode `0600`; no passwords, history, bookmarks, cache, preferences, extensions, or other Profile 4 browsing data are copied.
- Playwright launches a persistent context only against that disposable staged user-data root with installed Chrome and `--profile-directory=Profile 4`, allowing Chrome to decrypt its own cookies. The staged context is used directly by existing discovery. It is removed after success, ordinary failure, browser-launch failure, and the hard timeout. Chrome-created ephemeral files exist only inside that run directory and are removed with it.
- Browser navigates only to `https://x.com/monarchreport25/articles` for discovery. It observes the page's own `UserArticles` / `UserArticlesTweets` GraphQL responses, verifies authenticated account navigation, and follows bounded scrolling. No independently constructed authenticated API calls.
- Discovery succeeds only with recognized timeline instructions plus an explicit bottom termination marker. Missing/changed response shape, pagination cap, rate limit or login wall fails closed rather than reporting no-new. X endpoint/schema changes may require adapting the parser after an authorized session is available.
- Full structured article content comes from the free public FxTwitter endpoint. Tweet ID, article ID and author must match. Empty, preview-only, flagged-truncated, invalid-date and unsupported/unresolved embed bodies are rejected. When upstream supplies `plain_text`, text must match all blocks. No DOM preview is accepted as body. This validates upstream's structured content; it cannot independently prove upstream did not omit content without indicating truncation.
- Existing JSON objects/order are preserved; new articles are deduplicated by article/tweet ID and appended in a same-directory atomic rename only after **all** candidates validate. A failed body aborts the whole batch. Normal run has a hard 115-second deadline plus at most 1.5 seconds for final status; body requests have 10-second timeouts and at most two attempts. HTTP 429 is never retried.
- Importer-owned PID lock prevents concurrent importer writes; dead PID locks are recoverable. Do not edit articles.json concurrently from other tools.
- `--dry-run` fetches/validates but never writes articles.json. It reports `wouldAddCount`, while status `addedCount` remains zero. It DOES update operational status/browser session state.

## Operational status and cooldown

`~/.hermes/profiles/monarch/state/x-article-sync/import-status.json`:

```json
{"status":"error","errorCode":"LOGIN_REQUIRED","lastSuccessfulDiscoveryAt":null,"addedCount":0}
```

Errors preserve the previous successful discovery timestamp; a successful discovery followed by body failure records the current discovery timestamp. Exit code is nonzero for any failure. A success means discovery and all candidate validations completed, not that deployment occurred.

`auth-backoff.json` in the same state directory persists a six-hour backoff for `LOGIN_REQUIRED` / `RATE_LIMITED`. Subsequent normal/dry runs return the same error without opening a browser or contacting X; checks do not extend the backoff. `--refresh-auth` bypasses only an active `LOGIN_REQUIRED` cooldown and only when explicitly supplied; it never bypasses `RATE_LIMITED`. A successful authenticated discovery clears stale auth backoff, so normal daily runs can reuse Profile 4 cookies with the standard backoff behavior. If Chrome cannot access macOS Keychain/app-bound encryption, the importer fails as `AUTH_COOKIE_ACCESS_FAILED` without exposing diagnostics or cookie values; do not approve or automate a password/permission prompt, and stop rather than trying another profile or paid fallback. The parent scheduler remains disabled pending review. No push, deployment or cron is performed here.

## Verification and remaining gate

All test upstream payloads are explicitly synthetic. Offline tests exercise normalization, identity failures, body/media rejection, verified/failed discovery boundaries, deduplication, atomic writes, status/error redaction, exact Profile 4 source validation, source-WAL-consistent SQLite staging, exact-host filtering, file modes, symlink rejection, cleanup, persistent staged-context launch, refresh-auth semantics, locking, persisted backoff and a real CLI subprocess under synthetic HOME (no browser/network).

The explicit live command `npm run sync-articles-free -- --dry-run --refresh-auth` used installed Chrome 153 with only the staged Profile 4 mirror. The source had 17 rows across the two allowed host keys (count only; no cookie payload columns were queried), but X did not expose authenticated account navigation, so the importer stopped with redacted `LOGIN_REQUIRED`. Both the preferred staged `Network/Cookies` layout and Chrome 153's matching legacy staged `Cookies` layout were tried during implementation; neither authenticated. No Keychain/password/permission prompt was clicked or automated, no other profile or paid fallback was attempted, and zero `chrome-profile-*` directories remained afterward. `articles.json` remained at 54 objects with unchanged SHA-256 `4e211ee309bf33b83559ebf0bec96646b482a606947c7f931ad5f527398dc5d4`, so the actual importer was correctly not run. **Successful authenticated discovery/body import is not yet live-verified.** Do not interpret synthetic tests as evidence that the current X response schema is confirmed.

Scoped audit at setup: 13 findings (1 critical, 8 high, 2 moderate, 2 low), including direct Next.js and its ecosystem/tooling. Playwright and playwright-core were not listed by this audit. No unrelated upgrades applied; review production Next.js exposure separately before deployment.
