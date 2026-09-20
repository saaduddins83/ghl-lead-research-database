// Vercel serverless function: POST /api/trigger-research
//
// The dashboard's "Run research now" button calls this endpoint. It does NOT
// run any research itself — it just opens a GitHub issue on this repo with a
// recognizable title. A Claude Code trigger configured on the repo (Settings
// in claude.ai/code, watching for new issues titled "Manual research trigger")
// picks that issue up and starts a session that follows
// CLAUDE_MASTER_INSTRUCTIONS.md: read the database, research, dedupe, and
// commit updated leads/companies/search-history/CSV/docs mirrors as usual.
//
// Required Vercel project environment variables (set in the Vercel dashboard,
// never committed to the repo):
//   GITHUB_TOKEN   - a fine-grained GitHub PAT scoped to ONLY this repo, with
//                     "Issues: Read and write" permission (nothing else needed)
//   TRIGGER_SECRET - any passphrase you choose; the button prompts for this
//                     so random visitors can't spam issues on your repo

const OWNER = "saaduddins83";
const REPO = "ghl-lead-research-database";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const providedSecret = req.headers["x-trigger-secret"];
  if (!process.env.TRIGGER_SECRET || providedSecret !== process.env.TRIGGER_SECRET) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (!process.env.GITHUB_TOKEN) {
    return res.status(500).json({ error: "Server misconfigured: GITHUB_TOKEN is not set" });
  }

  const timestamp = new Date().toISOString();

  try {
    const ghRes = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/issues`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        Accept: "application/vnd.github+json",
        "Content-Type": "application/json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
      body: JSON.stringify({
        title: `Manual research trigger — ${timestamp}`,
        body:
          "Requested from the live dashboard via the \"Run research now\" button.\n\n" +
          "This issue exists to fire a Claude Code trigger configured on this repo — it is not meant to be " +
          "worked by a human. Follow CLAUDE_MASTER_INSTRUCTIONS.md: read database/leads.json, " +
          "database/companies.json, research/search-history.json and research/search-sources.json first, " +
          "then research, verify, dedupe against the existing database, and update leads.json / companies.json " +
          "/ search-history.json / leads.csv / docs/data/*.json as usual. Safe to close once the research " +
          "session has committed its results.",
      }),
    });

    if (!ghRes.ok) {
      const detail = await ghRes.text();
      return res.status(502).json({ error: "GitHub API error", detail });
    }

    const issue = await ghRes.json();
    return res.status(200).json({ ok: true, issue_url: issue.html_url, issue_number: issue.number });
  } catch (err) {
    return res.status(500).json({ error: "Request failed", detail: String(err) });
  }
}
