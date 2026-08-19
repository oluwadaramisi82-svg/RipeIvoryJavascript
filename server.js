const express = require("express");
const path = require("path");
const crypto = require("crypto");
const fs = require("fs");
const { Pool } = require("pg");
const { ReplitConnectors } = require("@replit/connectors-sdk");

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const connectors = new ReplitConnectors();

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
function sanitizeGuestName(value) {
  return String(value || "")
    .normalize("NFKC")
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, "")
    .replace(/[<>]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 120);
}
const fmt = (d) =>
  new Date(d).toLocaleString("en-GB", {
    timeZone: "Africa/Lagos",
    dateStyle: "medium",
    timeStyle: "short",
  }) + " (WAT)";

// ── Failure email alerts ───────────────────────────────────────────────────────
// The mailer is isolated from visitor requests: an alert delivery problem must
// never make the invitation unavailable or create repeated error cascades.
const ALERT_EMAIL_TO = process.env.ALERT_EMAIL_TO;
const ALERT_EMAIL_FROM = process.env.ALERT_EMAIL_FROM;
const ALERT_COOLDOWN_MS = 15 * 60 * 1000;
const recentAlerts = new Map();

function alertMessage(error) {
  const value = error instanceof Error ? error.stack || error.message : String(error || "Unknown error");
  return value.replace(/[\u0000-\u001F\u007F-\u009F]/g, " ").slice(0, 2000);
}

async function sendFailureAlert(kind, error, context = {}) {
  if (!ALERT_EMAIL_TO || !ALERT_EMAIL_FROM) {
    console.warn("Failure alert not sent: alert email settings are missing.");
    return false;
  }

  const key = `${kind}:${context.path || ""}`;
  const now = Date.now();
  if (now - (recentAlerts.get(key) || 0) < ALERT_COOLDOWN_MS) return false;
  recentAlerts.set(key, now);

  const details = [
    `Time: ${new Date(now).toISOString()}`,
    context.method && context.path ? `Request: ${context.method} ${context.path}` : null,
    `Details: ${alertMessage(error)}`,
  ]
    .filter(Boolean)
    .join("\n");

  try {
    const response = await connectors.proxy("resend", "/emails", {
      method: "POST",
      body: {
        from: ALERT_EMAIL_FROM,
        to: [ALERT_EMAIL_TO],
        subject: `[T&A Wedding Alert] ${kind}`,
        text: `The wedding invitation needs attention.\n\n${details}`,
      },
    });
    if (!response.ok) {
      const responseText = (await response.text()).slice(0, 500);
      throw new Error(`Resend returned ${response.status}: ${responseText}`);
    }
    console.log(`Failure alert sent: ${kind}`);
    return true;
  } catch (alertError) {
    recentAlerts.delete(key);
    console.error(`Failure alert could not be sent (${kind}):`, alertError.message);
    return false;
  }
}

async function alertThenStop(reason, error) {
  await Promise.race([
    sendFailureAlert(`Fatal server error: ${reason}`, error),
    new Promise((resolve) => setTimeout(resolve, 2500)),
  ]);
  stopServer(reason, 1);
}

// ── App setup ─────────────────────────────────────────────────────────────────
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
let httpServer;
let shuttingDown = false;

const DASHBOARD_COOKIE = "ta_dashboard_session";
// Keep the private dashboard session available through one year after the wedding.
const DASHBOARD_SESSION_EXPIRES_AT = new Date("2027-11-21T23:59:59+01:00").getTime();

function stopServer(reason, exitCode = 0) {
  if (shuttingDown) return;
  shuttingDown = true;
  console.log(`Shutting down (${reason})...`);

  const finish = () => {
    pool.end()
      .catch((err) => console.error("Database pool shutdown failed:", err.message))
      .finally(() => process.exit(exitCode));
  };

  if (!httpServer) return finish();
  httpServer.close(finish);
  setTimeout(() => process.exit(exitCode || 1), 10000).unref();
}

process.on("SIGTERM", () => stopServer("SIGTERM"));
process.on("SIGINT", () => stopServer("SIGINT"));
process.on("uncaughtException", (err) => {
  console.error("Uncaught exception:", err);
  void alertThenStop("uncaughtException", err);
});
process.on("unhandledRejection", (reason) => {
  console.error("Unhandled rejection:", reason);
  void alertThenStop("unhandledRejection", reason);
});

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

function requireDashboardSession(req, res, next) {
  if (!hasDashboardSession(req)) {
    return res.status(401).send(dashboardLoginPage(res.app.locals.guestKey));
  }
  next();
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

// Serve the wedding music explicitly so mobile browsers can discover its media
// type, length, and byte-range support before attempting playback.
const WEDDING_AUDIO_PATH = path.join(
  __dirname,
  "attached_assets",
  "wedding-smooth-remix.mp3"
);

function serveWeddingAudio(req, res) {
  fs.stat(WEDDING_AUDIO_PATH, (statError, file) => {
    if (statError) return res.status(404).send("Audio not found.");

    const total = file.size;
    const baseHeaders = {
      "Content-Type": "audio/mpeg",
      "Content-Disposition": 'inline; filename="wedding-smooth-remix.mp3"',
      "Accept-Ranges": "bytes",
      "Cache-Control": "public, max-age=3600, immutable",
      "X-Content-Type-Options": "nosniff",
    };
    const rangeHeader = req.headers.range;

    if (!rangeHeader) {
      res.set({ ...baseHeaders, "Content-Length": total });
      if (req.method === "HEAD") return res.status(200).end();
      res.status(200);
      return fs.createReadStream(WEDDING_AUDIO_PATH).pipe(res);
    }

    const range = /^bytes=(\d*)-(\d*)$/.exec(rangeHeader);
    if (!range || (!range[1] && !range[2])) {
      return res.status(416).set({
        ...baseHeaders,
        "Content-Range": `bytes */${total}`,
      }).end();
    }

    let start = range[1] ? Number.parseInt(range[1], 10) : 0;
    let end = range[2] ? Number.parseInt(range[2], 10) : total - 1;
    if (!range[1] && range[2]) {
      const suffixLength = Number.parseInt(range[2], 10);
      start = Math.max(total - suffixLength, 0);
      end = total - 1;
    }

    if (!Number.isInteger(start) || !Number.isInteger(end) || start < 0 || start >= total || start > end) {
      return res.status(416).set({
        ...baseHeaders,
        "Content-Range": `bytes */${total}`,
      }).end();
    }

    end = Math.min(end, total - 1);
    const length = end - start + 1;
    res.status(206).set({
      ...baseHeaders,
      "Content-Length": length,
      "Content-Range": `bytes ${start}-${end}/${total}`,
    });
    if (req.method === "HEAD") return res.end();
    return fs.createReadStream(WEDDING_AUDIO_PATH, { start, end }).pipe(res);
  });
}

app.get("/audio/wedding-smooth-remix.mp3", serveWeddingAudio);
app.head("/audio/wedding-smooth-remix.mp3", serveWeddingAudio);

// ── Routes ────────────────────────────────────────────────────────────────────

// Record a visit — called from the invitation page beacon
app.post("/api/visit", async (req, res) => {
  try {
    const name = sanitizeGuestName(req.body && req.body.name);
    if (!name) return res.status(400).json({ ok: false, error: "name required" });
    await pool.query("INSERT INTO invitation_visits (guest_name) VALUES ($1)", [name]);
    res.json({ ok: true });
  } catch (err) {
    console.error("visit insert failed:", err.message);
    void sendFailureAlert("Guest visit tracking failed", err, { method: req.method, path: req.path });
    res.status(500).json({ ok: false });
  }
});

// Record that a personalised QR code was generated for a guest.
app.post("/api/qr-created", async (req, res) => {
  try {
    const name = sanitizeGuestName(req.body && req.body.name);
    if (!name) return res.status(400).json({ ok: false, error: "name required" });
    await pool.query("INSERT INTO guest_qr_codes (guest_name) VALUES ($1)", [name]);
    res.json({ ok: true });
  } catch (err) {
    console.error("QR record failed:", err.message);
    void sendFailureAlert("QR tracking failed", err, { method: req.method, path: req.path });
    res.status(500).json({ ok: false });
  }
});

app.get("/health", async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  try {
    await pool.query("SELECT 1");
    res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Health check failed:", err.message);
    void sendFailureAlert("Database health check failed", err, { method: req.method, path: req.path });
    res.status(503).json({ ok: false });
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
app.get("/dashboard", requireDashboardSession, (req, res) => {
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

// Keep an individual request failure from taking down the invitation server.
app.use((err, req, res, next) => {
  console.error("Unhandled request error:", err.message);
  void sendFailureAlert("Unhandled request error", err, { method: req.method, path: req.path });
  if (res.headersSent) return next(err);
  if (req.path.startsWith("/api/")) {
    return res.status(500).json({ ok: false, error: "Temporary server error" });
  }
  res.status(500).send("The invitation is temporarily unavailable. Please refresh and try again.");
});

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
    await sendFailureAlert("Server startup failed", err);
    return process.exit(1);
  }

  // 3. Listen
  if (shuttingDown) return;
  const port = process.env.PORT || 5000;
  httpServer = app.listen(port, "0.0.0.0", () => {
    const domain = process.env.REPLIT_DEV_DOMAIN || `localhost:${port}`;
    console.log(`Invitation server running on port ${port}`);
    console.log(`\n🔒 Guest-opens list (private — do not share this URL):`);
    console.log(`   https://${domain}/guests?key=${guestKey}`);
    console.log(`   CSV: https://${domain}/guests.csv?key=${guestKey}\n`);
  });
}

start().catch(async (err) => {
  console.error("Server startup failed:", err);
  await sendFailureAlert("Server startup failed", err);
  stopServer("startup failure", 1);
});
