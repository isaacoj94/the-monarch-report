# Handoff: GA4 Setup on The Monarch Report

**From:** Isaac's Claude Code session in /Users/isaacjeong/the-monarch-report
**Date:** 2026-05-15
**Git:** main (dirty: src/data/articles.json modified, public/articles/ untracked)

## 1. Goal
Add Google Analytics 4 tracking to https://monarchreport.org so we can see traffic, top pages, and referral sources. The site is a Next.js 16 App Router project on Vercel that auto-deploys from the `main` branch of github.com/isaacoj94/the-monarch-report. Brother (the recipient) is taking over the GA4 setup and may help with the site going forward.

## 2. Current State
- Site is live at https://monarchreport.org (also https://the-monarch-report.vercel.app).
- Repo: https://github.com/isaacoj94/the-monarch-report. Local clone at /Users/isaacjeong/the-monarch-report.
- Stack: Next.js 16.1.6, React 19.2.3, TypeScript, Tailwind v4, Recharts. App Router (src/app/).
- Vercel project: isaac-jeongs-projects/the-monarch-report. Auto-deploys on push to `main`.
- No GA4, no analytics of any kind installed yet.
- Existing env vars in Vercel: APIFY_API_TOKEN (tweets), OPINET_API_KEY (gas prices). BREVO_API_KEY is queued but not added.
- Layout file (src/app/layout.tsx) has no analytics script. It already loads fonts and an inline theme-flicker prevention script.
- Vercel account is on the Hobby plan (personal), which does not support adding collaborators. To give brother direct Vercel access we would need to create a Pro Team ($20/mo) and transfer the project. For GA4 alone he can work via GitHub and Isaac can add the env var.

## 3. Files In Flight
- `/Users/isaacjeong/the-monarch-report/src/app/layout.tsx` (file to edit, add Script tags after <body> opens)
- `/Users/isaacjeong/the-monarch-report/.env.local` (add NEXT_PUBLIC_GA_ID for local testing)
- `/Users/isaacjeong/the-monarch-report/package.json` (no edit needed, just confirms Next 16 + React 19)
- `/Users/isaacjeong/the-monarch-report/HANDOFF.md` (this doc)
- `/Users/isaacjeong/the-monarch-report/docs/AUDIT-2026-05-15.md` (separate audit from Codex; context only, not your task)

## 4. Changed This Session
None this session. The session produced this handoff and a separate Codex audit report; no application code changes yet.

## 5. Failed Attempts
None this session. (Note for context, not a failure: monarchreport.org is the live domain. Older notes referenced "themonarchreport.org" but that was never used.)

## 6. Task List
1. [ ] Get access
   1.1. [ ] Isaac invites brother to GitHub repo (Settings > Collaborators > Add people, role: Maintain)
   1.2. [ ] Brother accepts GitHub invite and clones the repo locally
   1.3. [ ] Brother sends Isaac his GA4 Measurement ID (format: G-XXXXXXXXXX) so Isaac can add NEXT_PUBLIC_GA_ID in Vercel
2. [ ] Create GA4 property in Google Analytics
   2.1. [ ] In analytics.google.com, create a new property for "The Monarch Report"
   2.2. [ ] Add a Web data stream for https://monarchreport.org
   2.3. [ ] Copy the Measurement ID (G-XXXXXXXXXX)
3. [ ] Wire GA4 into the Next.js app
   3.1. [ ] Edit src/app/layout.tsx, add the Script block shown in section 7 below
   3.2. [ ] Add NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX to .env.local for local testing
   3.3. [ ] Run `npm run dev`, load http://localhost:3000, confirm gtag fires in browser devtools (Network tab, filter `collect`)
4. [ ] Deploy
   4.1. [ ] Isaac adds NEXT_PUBLIC_GA_ID to Vercel env vars (Production, Preview, Development)
   4.2. [ ] Brother commits + pushes to main. Vercel auto-deploys.
   4.3. [ ] Confirm GA4 Realtime report shows live visits at https://monarchreport.org
5. [ ] Optional follow-ups
   5.1. [ ] Add SPA page-view tracking on route changes (only if GA4 Realtime is missing internal navigations; GA4 enhanced measurement usually catches these via history API)
   5.2. [ ] Wire up GA4 conversion events for newsletter signup

## 7. Next Step
Open `/Users/isaacjeong/the-monarch-report/src/app/layout.tsx`. Add `import Script from "next/script";` near the other imports. Then, inside `<body>`, as the first children before `{children}`, paste the following block.

```tsx
// at top of file, with other imports
import Script from "next/script";

// inside <body>, as the first children, before {children}
{process.env.NEXT_PUBLIC_GA_ID && (
  <>
    <Script
      src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
      strategy="afterInteractive"
    />
    <Script id="ga4-init" strategy="afterInteractive">
      {`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', { send_page_view: true });
      `}
    </Script>
  </>
)}
```

Then add `NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX` to `/Users/isaacjeong/the-monarch-report/.env.local` (replace with the real Measurement ID) and run `npm run dev` to verify locally before pushing.

---

## Known issues (not your problem, just context)
- The Korea Democracy Timeline (src/lib/editorial.ts) is manually maintained and currently stale (last event is 2026-03-07; today is 2026-05-15). Isaac will update.
- Inflation, interest rate, household debt are still hardcoded in `currentSnapshot` because no free API key is wired up yet. Isaac will decide whether to integrate KOSIS / BOK ECOS.
- Most other issues from the 2026-05-15 audit have been fixed in code (see `docs/AUDIT-2026-05-15.md`). USD/KRW, KOSPI, and gas auto-update via GitHub Actions cron.

## Tell Claude (in your new chat)
> Restate the Goal and Next Step in your own words before doing anything. Then proceed.
