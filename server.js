const express = require("express");
const path = require("path");
const crypto = require("crypto");
const { Pool } = require("pg");

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// ── Schema init ───────────────────────────────────────────────────────────────
// Runs once at startup before the server accepts requests.
// Idempotent (IF NOT EXISTS) so re-deploys are safe.
async function initSchema() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS invitation_visits (
      id          SERIAL PRIMARY KEY,
      guest_name  TEXT        NOT NULL,
      visited_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
}

// ── Guest-list access key ─────────────────────────────────────────────────────
// Derived from PGPASSWORD — a runtime-managed secret Replit never commits to
// source control. The key is stable across restarts and is printed to the
// workflow console at startup so Ahmad & Toyibat can copy their private URL.
// If PGPASSWORD is absent the server refuses to start rather than falling back
// to a guessable key.
function deriveGuestKey() {
  const seed = process.env.PGPASSWORD;
  if (!seed) throw new Error("PGPASSWORD not set — cannot derive guest-list key");
  return crypto.createHmac("sha256", seed).update("wedding-guest-list-v1").digest("hex").slice(0, 24);
}

// ── CSV helpers ───────────────────────────────────────────────────────────────
// Prefix formula-triggering chars with a tab so spreadsheet apps treat the
// cell as plain text, preventing formula-injection attacks.
function csvSafeText(v) {
  const s = String(v);
  return /^[=+\-@\t\r]/.test(s) ? `\t${s}` : s;
}
function csvCell(v) {
  return `"${csvSafeText(v).replace(/"/g, '""')}"`;
}

const esc = (s) =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
const fmt = (d) =>
  new Date(d).toLocaleString("en-GB", {
    timeZone: "Africa/Lagos",
    dateStyle: "medium",
    timeStyle: "short",
  }) + " (WAT)";

// ── App setup ─────────────────────────────────────────────────────────────────
const app = express();
app.use(express.json());

function checkKey(req, res, key) {
  if (req.query.key !== key) {
    res.status(403).send("Not authorized.");
    return false;
  }
  return true;
}

async function fetchVisits() {
  const { rows } = await pool.query(
    `SELECT guest_name,
            COUNT(*)::int AS visits,
            MIN(visited_at) AS first_visit,
            MAX(visited_at) AS last_visit
       FROM invitation_visits
      GROUP BY guest_name
      ORDER BY MAX(visited_at) DESC`
  );
  return rows;
}

// ── Routes ────────────────────────────────────────────────────────────────────

// Record a visit — called from the invitation page beacon
app.post("/api/visit", async (req, res) => {
  try {
    const name = String((req.body && req.body.name) || "").trim().slice(0, 120);
    if (!name) return res.status(400).json({ ok: false, error: "name required" });
    await pool.query("INSERT INTO invitation_visits (guest_name) VALUES ($1)", [name]);
    res.json({ ok: true });
  } catch (err) {
    console.error("visit insert failed:", err.message);
    res.status(500).json({ ok: false });
  }
});

// Private guest-opens page
app.get("/guests", async (req, res) => {
  const GUEST_LIST_KEY = res.app.locals.guestKey;
  if (!checkKey(req, res, GUEST_LIST_KEY)) return;
  try {
    const rows = await fetchVisits();
    const body = rows.length
      ? rows
          .map(
            (r) =>
              `<tr><td>${esc(r.guest_name)}</td><td>${r.visits}</td><td>${fmt(r.first_visit)}</td><td>${fmt(r.last_visit)}</td></tr>`
          )
          .join("\n")
      : `<tr><td colspan="4" class="empty">No one has opened their invitation yet.</td></tr>`;
    res.send(`<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<title>Guest Opens — Ahmad &amp; Toyibat</title>
<style>
  body{font-family:Georgia,'Times New Roman',serif;background:#fdf9f3;color:#3d2f23;margin:0;padding:2rem 1rem}
  .wrap{max-width:760px;margin:0 auto}
  h1{font-size:1.6rem;color:#7a5c3e;margin-bottom:.25rem}
  p.sub{margin-top:0;color:#8a7a68}
  table{width:100%;border-collapse:collapse;background:#fff;border:1px solid #e8ddcd;margin-top:1rem}
  th,td{padding:.6rem .8rem;text-align:left;border-bottom:1px solid #efe7d9;font-size:.95rem}
  th{background:#f6efe3;color:#7a5c3e}
  .empty{text-align:center;color:#9a8a78;padding:2rem}
  a.csv{display:inline-block;margin-top:1rem;color:#7a5c3e}
</style></head><body><div class="wrap">
<h1>Who has opened the invitation</h1>
<p class="sub">${rows.length} guest${rows.length === 1 ? "" : "s"} so far · times shown in Lagos time</p>
<table><thead><tr><th>Guest</th><th>Opens</th><th>First opened</th><th>Last opened</th></tr></thead>
<tbody>${body}</tbody></table>
<a class="csv" href="/guests.csv?key=${encodeURIComponent(GUEST_LIST_KEY)}">Download as spreadsheet (CSV)</a>
</div></body></html>`);
  } catch (err) {
    console.error("guest list failed:", err.message);
    res.status(500).send("Could not load the guest list.");
  }
});

// CSV export (formula-injection safe)
app.get("/guests.csv", async (req, res) => {
  const GUEST_LIST_KEY = res.app.locals.guestKey;
  if (!checkKey(req, res, GUEST_LIST_KEY)) return;
  try {
    const rows = await fetchVisits();
    const lines = ["Guest,Opens,First opened,Last opened"].concat(
      rows.map((r) =>
        [csvCell(r.guest_name), r.visits, csvCell(fmt(r.first_visit)), csvCell(fmt(r.last_visit))].join(",")
      )
    );
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", 'attachment; filename="invitation-opens.csv"');
    res.send(lines.join("\n"));
  } catch (err) {
    console.error("csv export failed:", err.message);
    res.status(500).send("Could not export the guest list.");
  }
});

// Static invitation files
app.use(
  express.static(path.join(__dirname), {
    setHeaders(res) {
      res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0");
    },
  })
);

// ── Boot sequence ─────────────────────────────────────────────────────────────
async function start() {
  // 1. Derive access key — fails fast if PGPASSWORD absent
  const guestKey = deriveGuestKey();
  app.locals.guestKey = guestKey;

  // 2. Apply schema — fails fast if DB unreachable
  try {
    await initSchema();
    console.log("Schema ready.");
  } catch (err) {
    console.error("Schema init failed — cannot start:", err.message);
    process.exit(1);
  }

  // 3. Listen
  const port = process.env.PORT || 5000;
  app.listen(port, "0.0.0.0", () => {
    const domain = process.env.REPLIT_DEV_DOMAIN || `localhost:${port}`;
    console.log(`Invitation server running on port ${port}`);
    console.log(`\n🔒 Guest-opens list (private — do not share this URL):`);
    console.log(`   https://${domain}/guests?key=${guestKey}`);
    console.log(`   CSV: https://${domain}/guests.csv?key=${guestKey}\n`);
  });
}

start();
