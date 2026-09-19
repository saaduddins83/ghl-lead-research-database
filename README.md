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
