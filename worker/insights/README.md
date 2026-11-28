# Insights

Anthony's private platform on its own subdomain, `insights.anthonyis.uk` (a custom domain on the site
worker). It tracks how AI engines talk about a brand, and later audits GA4 properties and turns
results into before-and-after reports. Only Anthony logs in. Nothing reaches a client until he
approves it.

Built so far: phase 1, the AI visibility tracker, phase 2, reports, and phase 3, the GA4 audit with
Search Console. Phase 4 adds client brands and scheduled dates.

## How it fits together

- **Pages** are rendered by the site worker (`worker/insights/`), a sibling of the client documents
  (`worker/docs/`). They reuse the docs login, security headers, rate limits, styles and email
  layout, so the two look and behave the same. `index.js` routes and handles actions, `pages.js`
  draws the admin pages, `dashboard.js` the AI visibility tab and the answer page.
- **Data** lives in Cloudflare D1, in the `insights` database (`INSIGHTS_DB`), not in this public repo.
  The worker creates and upgrades its own tables on first use (`db.js`): a schema version row says
  which steps have run, so there are no migration commands. Tables: `brands`, `prompts`, `runs`,
  `answers`, `scores`, `shots`, `reports`, `audits`. The schedule table arrives with phase 4.
- **The repo is public.** Brands, prompt lists, facts notes and results are entered in the admin and
  live only in the database. The only brand in code is the made-up one on the samples page.
- **Brands** have a name, the names and domains to look for in answers, a facts note, framing flags
  (label and what to look for), a launch date, a GA4 property, a Search Console property, the GA4
lead event (empty for a shop), a UK-only switch, how many times each
  prompt is asked a week (default 3) and the weekday of the weekly run.
- **Prompt lists** are pasted or edited as plain text in groups (`prompts.js`): a group line is a
  capital letter, a full stop and its name ("A. Recommendation, no modifier"), and each prompt is
  numbered. Groups A and B are compared on the dashboard. A prompt keeps its history while its
  wording stays the same; removed prompts are switched off, not deleted.
- **The engine** (`engine.js`) is one small interface: ask a prompt for a country, get back the
  text, cited links, number of searches, token counts and the model. Phase 1 has ChatGPT: the OpenAI
  Responses API with the `web_search` tool, location set to the UK, the prompt sent alone with no
  system prompt. Cited links are the `url_citation` annotations, with tracking parameters such as
  `utm_source=openai` stripped. `store: false`, so OpenAI doesn't keep the answers. The model that
  actually answered is saved on every answer.
- **Scoring** (`score.js`) has two layers, both saved per answer with a scorer version. By rule: is
  the brand named (its names, ignoring case, whole words), is its domain cited, which domains and
  pages are cited. By model: a second, cheaper call with a strict JSON schema returns the businesses
  and people recommended, in order, and each framing flag with a short quote as evidence. The facts
  note is passed in for wrong facts. If the model step fails, the rule layer is kept and the model
  step is retried. **Re-score this run** scores saved text again without asking the engine.
- **The runner** (`runner.js`) is a job queue in D1. Starting a run inserts one pending answer per
  prompt per attempt. A cron every 5 minutes takes a small batch (`INSIGHTS_BATCH`, default 4), asks,
  saves and scores, and starts each brand's weekly run on its weekday from 6am UK time, once per ISO
  week. **Run now** queues the run and asks the first batch straight away; while the brand page is
  open it asks for the next batch every 8 seconds and shows progress, so a 90-answer run takes
  roughly 10 to 15 minutes watched, or about two hours on the cron alone. Failed answers are
  retried twice, then marked failed; OpenAI rate limits don't use up a try. A run is complete when
  nothing in it is pending, and its failures are shown, not hidden. **Stop run** cancels what is
  still waiting. With nothing queued, the cron stops after one query.
- **The dashboard** shows, for a run: mention rate, average position when named, own site cited,
  the group A against group B gap, the trend across runs (with the launch date marked), a table per
  group, who is named instead (and how often above the brand), the most cited pages and sites, how
  often each framing flag appears, and every answer, filterable by group or prompt, with the full
  text one click away. The method note gives the dates, engine, model, answer counts, token use and
  the two limits: API answers are close to, but not the same as, the ChatGPT app, and answers vary
  from run to run. Charts are plain SVG drawn by the worker: no chart library, no outside scripts.
- **Samples** at `/admin/samples/` (admin only, `samples.js`): every page filled in for a made-up
  brand, Saltwater Supply Co., with six canned weekly runs, plus the two emails. They are drawn by
  the same code as the real pages and never touch the database or OpenAI. The comment tool runs on
  these pages only: its comments are public GitHub issues. Insights comments carry their host, so
  docs and insights each list only their own.

## Reports (phase 2)

- **What a report is.** Any finished run (a snapshot), or two finished runs side by side (before and
  after), as an A4 sheet at a private link, `/report/<token>/`, with the same sheet as a PDF at
  `/report/<token>/report.pdf`. The token is random (128 bits). Runs are the saved snapshots: every
  run is kept with its date, and a report takes its own copy of the numbers when it is made, so it
  never changes if runs are re-scored later. A draft can take a fresh copy (Refresh the numbers).
- **What it shows.** The visibility score and the three headline rates (counting only questions
  that don't name the business), the score table, the group table, who is named instead, the most
  cited sites and third-party pages, three short excerpts, and the method note with the dates,
  engine, model, answer counts and the two limits. Before and after shows each change and the
  comparison line ("Comparing ChatGPT's answers on … with …, N days apart", with the launch date
  when it falls between). The dashboard's What to do next is not in reports.
- **Recommendations** are Anthony's alone: a box on the report's settings page. Left empty, the
  section is left out. Nothing is ever written into it for him.
- **Making one.** The Reports tab lists the finished runs, each with a Make a report button (a
  snapshot), and a Before and after line: pick two runs, press Compare.
- **Sharing.** A new report is private: it opens only for Anthony, logged in. Share the link turns
  it on for anyone who has it; Turn sharing off turns it off at once (whoever has the link is told
  the report was withdrawn).
- **Sending by email** is switched off, and its fields are hidden, until `INSIGHTS_REPORT_EMAIL` is
  `approved`. Then a report's page gets a Send by email section: two presses ("Send to
  name@client?"), the PDF saved to Drive through the bridge (Insights folder, a subfolder per
  brand), and the email from Anthony's Gmail with the link and the PDF. The wording is
  `reportEmail` in `emails.js`, on the samples page.
- **The bridge** has a `report` folder kind (`worker/docs/apps-script/Code.gs`). After changing
  Code.gs, paste it into the Apps Script project and deploy a new version (Deploy > Manage
  deployments > edit > Version: New version > Deploy). The URL stays the same.

## Overview

The first tab, and where the brands list opens. One page on how people find the brand, from what
is already saved (the latest finished run, the run before it, and the latest GA4 audit), so it
costs nothing to open (`overview.js`).

- **The headline**, written by fixed rules: how often ChatGPT names the brand and its place among
  the businesses named, how many UK searches it is on Google page one for, and how many of the
  leads (or orders) came from Google search and AI assistants.
- **Four cards:** named by ChatGPT, place against competitors, Google page one, and leads (or
  orders) from search and AI. Each with its change and what it means.
- **What to do next:** up to four steps, in this order: fix the data if the check isn't clean,
  run what's missing or stale (an audit over 45 days old), the biggest drop of a page one search,
  the top page to get listed on, the searches on page two (the five most seen, kept by each audit),
  and the gap to the business named most. Each links to the tab with the detail.
- **From being seen to getting in touch:** Google and AI assistants side by side, seen, visited
  and leads (or orders and revenue).

## Competitors

The Competitors tab (`competitors.js`) works from answers a run has already saved and scored, so
it costs no extra API calls: tracking more competitors doesn't mean asking more questions.

- **The field.** Every business named in answers to questions that don't name the brand, ranked by
  the same visibility score as the AI visibility tab, with the change since the run before.
- **Closest competitors.** Score, mention rate, average position, the question groups where each
  is named more often than the brand, and how the answers describe them.
- **Head to head.** Mention rate per question group for the brand and each competitor.
- **Where to get listed.** Third-party pages cited in answers that recommend a competitor and
  leave the brand out, most first. The brand's and the competitors' own sites are left out.
- **How you're described.** The scorer (version 2) gives each recommended business a short
  description in the answer's words, and its website when the answer names it. Older runs show
  these after Re-score.
- **Their sites.** By hand, per competitor: a phone screenshot of the homepage and three checks
  (schema types on the homepage, an llms.txt file, and whether robots.txt shuts out GPTBot,
  OAI-SearchBot, ChatGPT-User, PerplexityBot, ClaudeBot or Google-Extended). Kept in `rivals`.

## GA4 audit and Search Console (phase 3)

- **Access.** The platform reads Google through its own read-only login: a service account
  (`insights-reader@anthonyisfreelance.iam.gserviceaccount.com`) in the `anthonyisfreelance`
  Google Cloud project, with the GA4 Data API and the Search Console API turned on. Its JSON key
  is the secret `GOOGLE_SA_KEY`. `google.js` signs its own token request (RS256, Web Crypto) and
  keeps the token for its hour. A brand gives access by adding that address as a **Viewer** on its
  GA4 property and a **Restricted** user on its Search Console property. Nothing else changes on
  their side.
- **An audit** (`audit.js`) is one period and, usually, a comparison (the period before or the
  same period last year; "Since launch" compares with last year and uses the standard line). It
  asks GA4 for up to twelve small reports in three batch calls and Search Console for up to eleven,
  well inside the Workers limit of 50 calls. It keeps totals, weekly sums and short lists only, in
  `audits.data`, never visitor-level data.
- **Step 1, the data check** (`dataCheck`, thresholds in `THRESHOLDS`):
  - Bot traffic: a source or city with over 10% of sessions and engagement under 5% or under a
    third of the rest of the site, or days at over 4x a normal day with half the engagement. One
    sign is use with care; two or more, or over 20% of sessions, is not reliable. Smaller ones
    (over 2% of sessions) are listed as "also seen" without changing the rating.
  - Internal links with UTM tags (sessions started from the brand's own pages with a campaign set):
    over 2% use with care, over 10% not reliable.
  - Duplicate transactions: over 0.5% of transactions use with care, over 2% not reliable.
  - Purchase tracking: a week with visits but no purchases is use with care; none at all on a shop
    is not reliable. For a lead site, no leads in the period is use with care.
  - "(not set)" landing pages: over 5% care, over 15% not reliable, shown on the landing page table
    only. It skews that table, not the totals, so it doesn't change the overall rating.

  The result is clean, use with care or not reliable, with the reasons and which numbers are still
  safe to use. Agreed with Anthony on 27 Nov 2026, then adjusted after testing against two known
  properties (one clean, one with heavy bot traffic) so both come out as expected.
- **Step 2, the numbers:** sessions, purchasers and transactions (exact), conversion rate, revenue
  (or leads for a lead site), devices, top landing pages, AI traffic and Google search. AI traffic
  is counted by source name (gpt, perplexity, gemini, claude, copilot, openai), never GA4's AI
  Assistant channel, and the "(not set)" medium share is noted. The UK-only switch filters GA4 to
  the United Kingdom and Search Console to GBR.
- **How it reads** (`ga4view.js`). The period in big capitals, the data check as a badge, a
  one or two sentence headline written by fixed rules from the numbers (never generated text), then
  four cards ranked for the brand: revenue, orders, conversion rate and visits for a shop; leads,
  conversion rate, visits and leads from AI for a lead site. Each card says the change in words
  ("12 fewer than the 78 before" under 100, a percentage above) and what the number means. Then
  where the leads or orders came from (by plain source name, with each source's rate), and "Being
  found": Google search in the UK, with the brand's own name, and AI assistants.
- **What changed.** The change in the main number split by source (Google, AI, direct, email and
  so on), biggest movers first, so a drop has a cause next to it. Sources under 20 visits show no
  rate, as a rate on so few visits means little.
- **Week by week.** Visits, and revenue or leads, per whole week, with the same weeks of the
  comparison period in grey behind. Part weeks at either end are left out.
- **Show the detail.** The data check, AI assistants, Google search, devices and landing pages sit
  in a drop-down below. A link to `#check` (the data check badge) opens it.
- **Google positions, UK.** Every UK search the site showed up for at least 5 times (read in one
  call per period, up to 2,000 searches), counted into bands: top 3, 4 to 10, 11 to 20, 21 to 50,
  51 and lower, against the comparison period. Also the top searches with their position change,
  and the biggest climbs and drops among searches seen at least 10 times in both periods. Only the
  counts and short lists are kept.
- **Reports.** Any audit can become a GA4 report (Make a report on the GA4 tab): the same A4 sheet
  and PDF, private until shared. AI visibility reports made after an audit also show "What it
  brought in": visits and orders (or leads) from AI assistants and Google search clicks from the
  latest audit.

## Settings

Worker (Cloudflare dashboard > Worker > Settings > Variables and secrets). Add secrets as secrets:
plain-text variables set in the dashboard are wiped by the next deploy.

| Name | Type | What |
| --- | --- | --- |
| `OPENAI_API_KEY` | secret | The OpenAI key (project "Insights"). Set a monthly spending limit on the OpenAI account |
| `INSIGHTS_DB` | D1 binding | The `insights` database, in `wrangler.jsonc` |
| `INSIGHTS_HOST` | var | `insights.anthonyis.uk` |
| `INSIGHTS_ENGINE_MODEL` | var | `chat-latest`: OpenAI's alias for the Instant model ChatGPT uses (checked 27 Nov 2026) |
| `INSIGHTS_SCORER_MODEL` | var | `gpt-6-luna`: the cheapest current model with structured outputs (checked 27 Nov 2026) |
| `INSIGHTS_BATCH` | var | Answers per batch, default 4 (at most 8) |
| `INSIGHTS_RUN_HOUR` | var, optional | Hour (UK) from which weekly runs start, default 6 |
| `INSIGHTS_REPORT_EMAIL` | var | Set to `approved` once Anthony approves the client report email. Until then, Send is off |
| `GOOGLE_SA_KEY` | secret | The service account's JSON key, the whole file. Anthony adds it; never in chat or the repo |

Reused from the documents: `DOCS_SECRET` (signs the login cookies), `RESEND_API_KEY` and
`ADMIN_EMAIL` (login codes and notices), `BRIDGE_URL` and `BRIDGE_KEY` (report PDFs to Drive and
client emails from Gmail).

`wrangler.jsonc` adds the D1 binding, the vars, a cron trigger (`*/5 * * * *`) and `/report/*` to
`run_worker_first`. The worker's `scheduled` handler (`worker/index.js`) calls the runner.

**Limits.** The build is designed for Workers Free: 10 ms of CPU per request and per cron run
(waiting on OpenAI doesn't count), 50 subrequests and 50 D1 queries per invocation, 5 cron
triggers per account. A batch of 4 uses about 15 subrequests and queries. Cloudflare says each
isolate has some flexibility on CPU but doesn't say how much; if the logs show runs ending with CPU
limit errors, the fix is Workers Paid (about $5 a month), and that is Anthony's call. Prompt lists
are capped at 45 prompts so saving one stays within the query limit.

**Google AI Mode.** A second engine through DataForSEO's AI Mode API (live mode, United Kingdom,
desktop, English). It switches on when two secrets are set on the worker, `DATAFORSEO_LOGIN` and
`DATAFORSEO_PASSWORD` (the API login and password from the DataForSEO dashboard, under API Access).
Every run then starts a Google run alongside the ChatGPT one, with the same prompts and number of
asks, scored the same way. The Google answers are worked through by the cron in the background. The
AI visibility tab gets a ChatGPT | Google AI Mode switch; the Overview, Competitors and reports stay
on ChatGPT for now. Each answer costs $0.004 at DataForSEO (checked 28 Nov 2026), so 90 answers is
about 36 cents. Locally, `INSIGHTS_FAKE_GOOGLE_AI=1` turns on canned Google answers.

**Cost.** Every answer is one OpenAI call with web search ($10 per 1,000 searches, and the search
results count as input tokens at the model's rate) plus one small scoring call. The method note on
each run shows its searches and tokens, so the real cost per run can be read off the first one.

## Security

Everything in the docs Security section applies here too (`worker/docs/README.md`). In particular:

- **Admin** login is a one-time code to `ADMIN_EMAIL`, valid 10 minutes, five tries per code, a
  14-day session per browser, a notice email after every login, and Log out. Cookies (`ins_admin`,
  `ins_admin_code`) are separate from the documents' and marked for insights, so a docs login never
  opens insights. Changing `DOCS_SECRET` logs everyone out of both.
- **Every admin page and action** checks the session. **POSTs** are JSON only and must come from a
  page on this site (Origin check).
- **Pages** carry the docs headers: a strict Content Security Policy (only scripts with that
  response's nonce run), no framing, no referrer, never cached or indexed.
- **AI answers are untrusted.** Answer text, recommended names, quotes, cited titles and links are
  escaped everywhere. Only http and https links are made clickable, with
  `rel="noopener noreferrer nofollow"`. The scorer is told the answer is data and to ignore any
  instructions inside it, and its output is checked against the schema and the brand's own flag
  keys before it is saved.
- **Rate limits** per IP use the docs bindings with their own counters: 60 page views, 20 posts and
  5 guesses a minute at any one code.
- **Reports** show that report's own data and nothing else. Private reports open only for Anthony; a
  link with sharing turned off answers 410 at once, the PDF included. Report pages and PDFs carry the same headers
  as every page (noindex, never cached), and fresh PDF renders are rate limited.
- **Google** access is read-only (the `analytics.readonly` and `webmasters.readonly` scopes) and
  granted per property by its owner. GA4 page paths, search queries and source names are escaped
  like AI answers.
- **Secrets** live in Cloudflare, never in this repo. Brand data and results live in D1.

## Testing locally

1. Build the site once for the fonts: `npm run build`.
2. Make a `.dev.vars` file (never committed) with `INSIGHTS_DEV=1`, `INSIGHTS_FAKE_AI=1`,
   `INSIGHTS_FAKE_GOOGLE=1` and `DOCS_SECRET=` any local string. `INSIGHTS_FAKE_GOOGLE=1` gives
   canned GA4 and Search Console responses, shaped like the real ones. `INSIGHTS_FAKE_AI=1` gives canned answers and scores, so every
   flow runs without an OpenAI key. Without `RESEND_API_KEY`, codes are printed in the log and
   shown on the login page.
3. `npx wrangler dev --local --test-scheduled`, then open `http://localhost:8787/admin/`.
4. `node worker/insights/test.mjs` runs the unit tests;
   `BASE=http://127.0.0.1:8787 node worker/insights/test.mjs` also runs the whole flow against the
   local worker: login and code limits, the Origin check, a run with the fake engine through to
   complete (with failures), scoring and re-scoring, stopping a run, the cron and weekly run,
   reports (draft privacy, recommendations, approve, the PDF, withdraw and restore, the send guard,
   before and after), a GA4 audit and its report with the fake Google, the samples, and the rate
   limits. `DOCS_FAKE_PDF=1` in `.dev.vars` gives
   placeholder PDFs without a browser.
