# Free X Article sync

```sh
cd /Users/jeongxclaw1/.hermes/profiles/monarch/workspaces/the-monarch-report
npm run test:sync-articles-free
npm run sync-articles-free -- --dry-run
# Explicitly bypass only an active LOGIN_REQUIRED cooldown; this does not export cookies:
npm run sync-articles-free -- --dry-run --refresh-auth
npm run sync-articles-free
```

## Authentication

- Runtime reads only `/Users/jeongxclaw1/.hermes/profiles/monarch/state/x-article-sync/yoo-suk-x-cookies.json`. The file is a local secret and is never written to the repository.
- The export provenance is Google Chrome **Profile 4**, public label **Yoo Suk**. The importer does not read a live Chrome profile, stage a cookie database, decrypt cookies, scan other profiles/browsers, or use a paid fallback.
- Before reading, the importer requires the exact absolute path, opens it with `O_NOFOLLOW`, and validates a regular file owned by the current uid with no group/other mode bits, a nonzero size of at most 64 KiB, and a strict JSON envelope. It accepts exactly two records: one nonempty `auth_token` and one nonempty `ct0`, only for `x.com` or `.x.com`, with no unknown fields. Validation and runtime errors expose only `AUTH_COOKIE_ACCESS_FAILED`; cookie values are never logged or written elsewhere.
- Playwright launches installed Chrome headlessly with a new nonpersistent browser context, maps the validated export to minimal in-memory Playwright cookies, and adds only those two cookies. Context and browser are closed on success, failure, and timeout.
- Refresh is manual/auth-failure-only because macOS Keychain access can prompt and block unattended work. `npm run refresh-x-auth` invokes the pinned local `@steipete/sweet-cookie@0.4.3` executable against only Profile 4, with the `auth_token`/`ct0` name allowlist and a 30000 ms helper timeout. The external helper uses `umask 077`, captures output without printing values, validates it, writes a mode-0600 temp file, fsyncs, atomically replaces the approved file, and validates the result. `npm run refresh-x-auth -- --validate-only` checks the current file without exporting.

## Discovery and import safety

- `scripts/sync-articles-free.mjs` is the free-only entry point. It never imports the legacy paid scraper or loads dotenv. Existing paid entry points are unchanged and are not fallbacks.
- Browser discovery navigates only to `https://x.com/monarchreport25/articles` and observes the page's `UserArticles` / `UserArticlesTweets` GraphQL responses. It verifies authenticated account navigation and uses bounded scrolling; it does not construct authenticated API requests independently.
- Discovery succeeds only for the target user's recognized Articles timeline and positive pagination termination. Current X pagination ends with a verified cursor-only page whose Bottom cursor remains nonempty; this exact shape is accepted. Missing/changed response shape, pagination cap, rate limit, or login wall fails closed.
- Full structured bodies come from the free public FxTwitter endpoint. Tweet ID, article ID, and author must match. Empty, preview-only, flagged-truncated, invalid-date, and unresolved embedded bodies are rejected. Supported body elements include text/headings/lists/quotes, images, dividers, and videos with an HTTPS MP4 plus preview image. A tightly matched empty X-editor atomic artifact is preserved as spacing; other unresolved atomics fail closed. When upstream supplies `plain_text`, it must match the text blocks.
- Existing objects/order are preserved. New articles are deduplicated by article and tweet ID and appended with a same-directory atomic rename only after every candidate validates. Any body failure aborts the entire batch. `--dry-run` fetches and validates but never writes `articles.json`; status `addedCount` remains zero while `wouldAddCount` reports the pending count.
- The importer has a 115-second process deadline, 10-second body request timeouts with at most two attempts, no retry for HTTP 429, and an importer-owned PID lock with positively dead-owner recovery.

## Operational status and cooldown

State lives under `~/.hermes/profiles/monarch/state/x-article-sync/`. `import-status.json` records a stable error code, preserves the last successful discovery timestamp on errors, and records the actual added count on success. `auth-backoff.json` persists a six-hour `LOGIN_REQUIRED` or `RATE_LIMITED` cooldown without sliding it on checks. `--refresh-auth` bypasses only `LOGIN_REQUIRED`; it never re-exports cookies and never bypasses `RATE_LIMITED`. Successful authenticated discovery clears stale auth backoff.

The daily runner should use the static approved export first and must not call `refresh-x-auth` every day. No scheduler, push, merge, or deployment is performed by this work.

## Live verification

On 2026-09-12, the authorized `npm run sync-articles-free -- --dry-run --refresh-auth` run completed authenticated current-X discovery and full-body validation: 135 articles discovered and 82 would be added, with no data write. One subsequent actual importer run discovered 135 and added 82. `articles.json` changed from 54 to 136 objects; all 136 article IDs and all 136 tweet IDs are unique, all 54 prior objects are canonical-byte-equivalent, and all 82 appended bodies passed stored full-body/media validation. File SHA-256 changed from `4e211ee309bf33b83559ebf0bec96646b482a606947c7f931ad5f527398dc5d4` to `fc441e2aa380beaac03da6558865bc7caae85f772c5bc88992bf251d0dafc383`. Final status was `success`, `errorCode: null`, `addedCount: 82`.

All test fixtures are explicitly synthetic. Offline tests cover cookie path/mode/symlink/size/shape/redaction, isolated browser boundaries and cleanup, current X pagination termination, body/media/video/divider validation, identity failures, deduplication, atomic writes, locking, status redaction, and cooldown behavior.
