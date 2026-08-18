-- Schema for the wedding invitation visit tracking.
-- Applied idempotently to the DEVELOPMENT database by scripts/post-merge.sh.
-- The production database schema is synced automatically by Replit's Publish flow.

CREATE TABLE IF NOT EXISTS invitation_visits (
  id SERIAL PRIMARY KEY,
  guest_name TEXT NOT NULL,
  visited_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
