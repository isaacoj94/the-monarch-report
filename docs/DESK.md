# Monarch evidence desk

The public site is still a static Next.js archive. X collection now writes **unpublished drafts** into `src/data/desk/` from GitHub Actions. Nothing from X or OpenRouter is auto-published.

## Why this is cheap

- Collector A uses the official X API with `since_id` when `X_BEARER_TOKEN` exists. No LLM tokens.
- Collector B uses OpenRouter’s native X search on `x-ai/grok-4.1-fast` (`$0.20 / $0.50` per 1M tokens, plus ~`$0.005` per search).
- One beat per daily run. Image/video understanding is off. `max_tool_calls` is 2. Completion cap is 1200 tokens.
- Daily spend ceiling defaults to `$0.40` (`DESK_DAILY_BUDGET_USD`).
- Challenge/verification is **off** unless the job is run with `--verify`.
- Invalid JSON is stored as a failure, not retried.
- `OPENROUTER_API_KEY` and `X_BEARER_TOKEN` stay in GitHub Actions. Do not put them on Vercel. That is how the old Apify integration burned credits on cold starts.

## Secrets Isaac needs to add

GitHub repo → Settings → Secrets and variables → Actions:

| Secret | Required | Purpose |
| --- | --- | --- |
| `OPENROUTER_API_KEY` | for discovery | Collector B |
| `X_BEARER_TOKEN` | preferred | Collector A, own account, `$0` LLM |
| `X_USER_ID` | optional | Skip the username lookup |
| `DESK_DAILY_BUDGET_USD` | optional | Default `0.40` |
| `DESK_MODEL` | optional | Default `x-ai/grok-4.1-fast` |

Vercel (site only):

| Env | Purpose |
| --- | --- |
| `DESK_PASSWORD` | Unlocks `/desk` |

Do **not** add `OPENROUTER_API_KEY` to Vercel.

## Commands

```bash
npm run desk-selfcheck
npm run collect-x:dry
npm run collect-x          # needs keys; writes src/data/desk
npx tsx scripts/collect-x.ts --verify   # extra OpenRouter call, still unpublished
```

## What the public sees

- `/articles` is the repaired archive. `LATEST` only appears on articles less than 14 days old. Frozen X likes/views are no longer shown as live.
- `/now` is What’s Happening Now. It renders **approved** events only, so it stays empty until an editor changes `reviewState` to `approved` in `src/data/desk/inbox.json`.
- `/desk` is the unpublished inbox.

## Later

`src/lib/desk/schema.sql` is the Postgres target when a managed database exists. The collector’s JSON store is the working backend until then.
