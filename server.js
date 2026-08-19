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
  await pool.query(`
    CREATE TABLE IF NOT EXISTS guest_qr_codes (
      id          SERIAL PRIMARY KEY,
      guest_name  TEXT        NOT NULL,
      created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
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
app.use(express.urlencoded({ extended: false }));

const DASHBOARD_COOKIE = "ta_dashboard_session";
// Keep the private dashboard session available through the week after the wedding.
const DASHBOARD_SESSION_EXPIRES_AT = new Date("2026-11-28T23:59:59+01:00").getTime();

function dashboardSignature(value) {
  return crypto.createHmac("sha256", process.env.SESSION_SECRET).update(value).digest("hex");
}

function dashboardSessionValue() {
  const issuedAt = Date.now().toString();
  return `${issuedAt}.${dashboardSignature(issuedAt)}`;
}

function hasDashboardSession(req) {
  const cookies = String(req.headers.cookie || "").split(";").reduce((all, part) => {
    const [key, ...value] = part.trim().split("=");
    if (key) all[key] = decodeURIComponent(value.join("=") || "");
    return all;
  }, {});
  const [issuedAt, signature] = String(cookies[DASHBOARD_COOKIE] || "").split(".");
  if (!issuedAt || !signature || !/^\d+$/.test(issuedAt)) return false;
  if (Date.now() >= DASHBOARD_SESSION_EXPIRES_AT) return false;
  const expected = dashboardSignature(issuedAt);
  return signature.length === expected.length && crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
}

function dashboardLoginPage(key, message = "") {
  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow"><title>Private Guest Dashboard</title>
<style>
body{font-family:Georgia,'Times New Roman',serif;background:#fdf9f3;color:#3d2f23;margin:0;padding:4rem 1rem}
.box{max-width:380px;margin:0 auto;background:#fff;border:1px solid #e8ddcd;padding:2rem;box-shadow:0 12px 35px rgba(61,47,35,.12)}
h1{font-size:1.6rem;color:#7a5c3e;margin:0 0 .4rem}p{color:#8a7a68;line-height:1.5}
label{display:block;color:#7a5c3e;font-size:.78rem;margin:1.3rem 0 .4rem}
input{width:100%;box-sizing:border-box;padding:.75rem;border:1px solid #d9cbb9;font:inherit}
button{margin-top:1rem;width:100%;padding:.75rem;border:0;background:#0d4b3a;color:#f1dfad;font-weight:bold;cursor:pointer}
.error{color:#a34d3f;font-size:.85rem}
</style></head><body><main class="box">
<h1>Private guest dashboard</h1><p>Enter the dashboard password to view QR and invitation activity.</p>
${message ? `<p class="error">${esc(message)}</p>` : ""}
<form method="post" action="/guests/login">
<input type="hidden" name="key" value="${esc(key)}">
<label for="password">Password</label>
<input id="password" name="password" type="password" autocomplete="current-password" required>
<button type="submit">Unlock dashboard</button>
</form></main></body></html>`;
}

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

async function fetchGuestRows() {
  const { rows } = await pool.query(`
    WITH visits AS (
      SELECT guest_name, COUNT(*)::int AS visits,
             MIN(visited_at) AS first_visit, MAX(visited_at) AS last_visit
      FROM invitation_visits GROUP BY guest_name
    ), qr_codes AS (
      SELECT guest_name, COUNT(*)::int AS qr_count,
             MIN(created_at) AS first_qr, MAX(created_at) AS last_qr
      FROM guest_qr_codes GROUP BY guest_name
    )
    SELECT COALESCE(v.guest_name, q.guest_name) AS guest_name,
           COALESCE(q.qr_count, 0)::int AS qr_count, q.first_qr, q.last_qr,
           COALESCE(v.visits, 0)::int AS visits, v.first_visit, v.last_visit
    FROM visits v FULL OUTER JOIN qr_codes q ON q.guest_name = v.guest_name
    ORDER BY COALESCE(q.last_qr, v.last_visit) DESC
  `);
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

// Record that a personalised QR code was generated for a guest.
app.post("/api/qr-created", async (req, res) => {
  try {
    const name = String((req.body && req.body.name) || "").trim().slice(0, 120);
    if (!name) return res.status(400).json({ ok: false, error: "name required" });
    await pool.query("INSERT INTO guest_qr_codes (guest_name) VALUES ($1)", [name]);
    res.json({ ok: true });
  } catch (err) {
    console.error("QR record failed:", err.message);
    res.status(500).json({ ok: false });
  }
});

app.post("/guests/login", (req, res) => {
  const key = String(req.body.key || "");
  if (key !== res.app.locals.guestKey) return res.status(403).send("Not authorized.");
  const password = String(req.body.password || "");
  const expected = process.env.GUEST_DASHBOARD_PASSWORD;
  if (!expected || password.length !== expected.length ||
      !crypto.timingSafeEqual(Buffer.from(password), Buffer.from(expected))) {
    return res.status(401).send(dashboardLoginPage(key, "That password is not correct."));
  }
  const secure = req.headers["x-forwarded-proto"] === "https" || req.secure;
  const maxAge = Math.max(0, Math.floor((DASHBOARD_SESSION_EXPIRES_AT - Date.now()) / 1000));
  res.setHeader("Set-Cookie", `${DASHBOARD_COOKIE}=${encodeURIComponent(dashboardSessionValue())}; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${secure ? "; Secure" : ""}`);
  res.redirect(`/guests?key=${encodeURIComponent(key)}`);
});

// Easier private guest-list entry point. It keeps the access key out of the
// first URL guests see while retaining password protection.
app.get("/dashboard", (req, res) => {
  if (!hasDashboardSession(req)) {
    return res.status(401).send(dashboardLoginPage(res.app.locals.guestKey));
  }
  res.redirect(`/guests?key=${encodeURIComponent(res.app.locals.guestKey)}`);
});

app.get("/guest-list", (req, res) => {
  res.redirect("/dashboard");
});

app.get("/guests", async (req, res) => {
  const GUEST_LIST_KEY = res.app.locals.guestKey;
  if (!checkKey(req, res, GUEST_LIST_KEY)) return;
  if (!hasDashboardSession(req)) return res.status(401).send(dashboardLoginPage(req.query.key));
  try {
    const rows = await fetchGuestRows();
    const body = rows.length
      ? rows
          .map(
            (r) =>
              `<tr><td>${esc(r.guest_name)}</td><td>${r.qr_count ? `Yes · ${r.qr_count}` : "No"}</td><td>${r.last_qr ? fmt(r.last_qr) : "—"}</td><td>${r.visits ? `Yes · ${r.visits}` : "No"}</td><td>${r.last_visit ? fmt(r.last_visit) : "—"}</td></tr>`
          )
          .join("\n")
      : `<tr><td colspan="5" class="empty">No QR codes or invitation opens recorded yet.</td></tr>`;
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
<h1>Guest invitation activity</h1>
<p class="sub">${rows.length} guest${rows.length === 1 ? "" : "s"} with QR or open activity · times shown in Lagos time</p>
<table><thead><tr><th>Guest</th><th>QR created</th><th>Last QR created</th><th>Invitation opened</th><th>Last opened</th></tr></thead>
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
  if (!hasDashboardSession(req)) return res.status(401).send("Dashboard password required.");
  try {
    const rows = await fetchGuestRows();
    const lines = ["Guest,QR created,Last QR created,Invitation opened,Last opened"].concat(
      rows.map((r) =>
        [csvCell(r.guest_name), r.qr_count, csvCell(r.last_qr ? fmt(r.last_qr) : ""), r.visits, csvCell(r.last_visit ? fmt(r.last_visit) : "")].join(",")
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
