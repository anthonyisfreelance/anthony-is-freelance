# Insights

Anthony's private platform on its own subdomain, `insights.anthonyis.uk` (a custom domain on the site
worker). It tracks how AI engines talk about a brand, and later audits GA4 properties and turns
results into before-and-after reports. Only Anthony logs in. Nothing reaches a client until he
approves it.

Built so far: phase 1, the AI visibility tracker, and phase 2, reports. Phase 3 adds the GA4 audit,
phase 4 client brands and scheduled dates.

## How it fits together

- **Pages** are rendered by the site worker (`worker/insights/`), a sibling of the client documents
  (`worker/docs/`). They reuse the docs login, security headers, rate limits, styles and email
  layout, so the two look and behave the same. `index.js` routes and handles actions, `pages.js`
  draws the admin pages, `dashboard.js` the AI visibility tab and the answer page.
- **Data** lives in Cloudflare D1, in the `insights` database (`INSIGHTS_DB`), not in this public repo.
  The worker creates and upgrades its own tables on first use (`db.js`): a schema version row says
  which steps have run, so there are no migration commands. Tables: `brands`, `prompts`, `runs`,
  `answers`, `scores`. Snapshots, reports, schedule and GA4 tables arrive with their phases.
- **The repo is public.** Brands, prompt lists, facts notes and results are entered in the admin and
  live only in the database. The only brand in code is the made-up one on the samples page.
- **Brands** have a name, the names and domains to look for in answers, a facts note, framing flags
  (label and what to look for), a launch date, a GA4 property, a UK-only switch, how many times each
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
- **Secrets** live in Cloudflare, never in this repo. Brand data and results live in D1.

## Testing locally

1. Build the site once for the fonts: `npm run build`.
2. Make a `.dev.vars` file (never committed) with `INSIGHTS_DEV=1`, `INSIGHTS_FAKE_AI=1` and
   `DOCS_SECRET=` any local string. `INSIGHTS_FAKE_AI=1` gives canned answers and scores, so every
   flow runs without an OpenAI key. Without `RESEND_API_KEY`, codes are printed in the log and
   shown on the login page.
3. `npx wrangler dev --local --test-scheduled`, then open `http://localhost:8787/admin/`.
4. `node worker/insights/test.mjs` runs the unit tests;
   `BASE=http://127.0.0.1:8787 node worker/insights/test.mjs` also runs the whole flow against the
   local worker: login and code limits, the Origin check, a run with the fake engine through to
   complete (with failures), scoring and re-scoring, stopping a run, the cron and weekly run,
   reports (draft privacy, recommendations, approve, the PDF, withdraw and restore, the send guard,
   before and after), the samples, and the rate limits. `DOCS_FAKE_PDF=1` in `.dev.vars` gives
   placeholder PDFs without a browser.
