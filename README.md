# GHL Lead Research Database

This repository is the persistent lead database for the GoHighLevel (GHL) client and job research workflow.

## Purpose

The database is designed for a research agent such as Claude to:

1. Read existing leads before every new research session.
2. Avoid reporting the same opportunity repeatedly.
3. Find new GHL, CRM, automation, integration, and agency opportunities.
4. Update existing records when new information is discovered.
5. Add every verified, qualified new lead to the database.
6. Track search history so future searches use different sources, keywords, and angles.
7. Preserve historical records instead of deleting them.

## Source of truth

`database/leads.json` is the master lead database.

`database/leads.csv` is a human-friendly export/view and should mirror the lead records.

`database/companies.json` tracks companies separately from individual opportunities.

## Repository structure

```text
ghl-lead-research-database/
├── README.md
├── database/
│   ├── leads.json
│   ├── leads.csv
│   └── companies.json
├── config/
│   ├── search-rules.json
│   ├── duplicate-rules.json
│   └── statuses.json
├── research/
│   ├── search-history.json
│   └── search-sources.json
└── .github/
    └── workflows/
        └── database-check.yml
```

## Important rules

- Never invent lead information.
- Use only public professional/business information.
- Never collect or expose private personal information.
- Never guess an email address.
- Never send outreach automatically unless explicitly authorized.
- Do not delete historical leads.
- Update existing records when appropriate.
- The same company may have multiple distinct opportunities.
- A lead is a duplicate when it represents the same underlying opportunity, not merely because the company is the same.
- Verify important details before saving a lead.
- Keep URLs and dates accurate.
- Use ISO dates: `YYYY-MM-DD`.
- Use the status values defined in `config/statuses.json`.

## Lead ID

Lead IDs use the format:

`GHL-0001`

New IDs continue from the highest existing ID.

## Research history

Every completed research session should be recorded in:

`research/search-history.json`

This helps prevent repetitive searching and encourages broader source and keyword coverage.

## Maintenance

The GitHub Actions workflow validates the JSON files and checks that the CSV contains the same number of lead records as `leads.json`.

The workflow does not automatically change lead data.

## Live dashboard (`docs/`)

`docs/index.html` is a static, data-driven dashboard that fetches `docs/data/leads.json`, `docs/data/companies.json`,
and `docs/data/search-history.json` at page load — those three files are plain mirrors of `database/leads.json`,
`database/companies.json`, and `research/search-history.json`, and must be kept in sync by hand (there is no build
step) whenever the database files change.

It only works served over HTTP(S) — opening it as a local `file://` path blocks the JSON fetches — either via
GitHub Pages, `python3 -m http.server` from inside `docs/`, or a Vercel deployment (see below).

### Deploying to Vercel

1. In Vercel, "Add New Project" → import this GitHub repo.
2. Set **Root Directory** to `docs`. Vercel then serves everything else in `docs/` as static files and
   auto-detects `docs/api/*.js` as serverless functions — no `vercel.json` needed.
3. Add a custom domain (e.g. a subdomain like `links.yourdomain.com`) in the Vercel project's Domains settings,
   then add the CNAME/A record it gives you at your DNS provider.
4. In the Vercel project's Environment Variables, set:
   - `GITHUB_TOKEN` — a fine-grained GitHub PAT scoped to **only this repo**, with "Issues: Read and write"
     permission (nothing else). Used server-side only, never exposed to the browser.
   - `TRIGGER_SECRET` — any passphrase you choose, used to gate the "Run research now" button below.

### "Run research now" button

The dashboard has a button that calls `docs/api/trigger-research.js` (a Vercel serverless function). It does not
run research itself — it opens a GitHub issue titled `Manual research trigger — <timestamp>`. For the button to
actually kick off a new research session, configure a Claude Code trigger on this repo (in the repo/session
settings at claude.ai/code — see https://code.claude.com/docs/en/claude-code-on-the-web) that starts a session
when a matching issue is opened, following `CLAUDE_MASTER_INSTRUCTIONS.md` as usual. Without that trigger
configured, the button will open the issue but nothing will act on it automatically.
