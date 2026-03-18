-- GoSupportMe Initial Schema
-- Run with: psql $DATABASE_URL -f infra/migrations/001_initial_schema.sql

BEGIN;

-- ─── Extensions ─────────────────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ─── Users ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email         TEXT NOT NULL UNIQUE,
  name          TEXT NOT NULL,
  bio           TEXT,
  avatar_url    TEXT,
  location      TEXT,
  role          TEXT NOT NULL DEFAULT 'donor' CHECK (role IN ('donor', 'organizer', 'admin')),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);

-- ─── Fundraisers ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS fundraisers (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organizer_id     UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  title            TEXT NOT NULL,
  story            TEXT NOT NULL,
  cover_image_url  TEXT,
  goal_cents       INTEGER NOT NULL CHECK (goal_cents > 0),
  raised_cents     INTEGER NOT NULL DEFAULT 0 CHECK (raised_cents >= 0),
  category         TEXT NOT NULL DEFAULT 'General',
  location         TEXT,
  is_urgent        BOOLEAN NOT NULL DEFAULT FALSE,
  status           TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('draft', 'active', 'paused', 'completed', 'removed')),
  donor_count      INTEGER NOT NULL DEFAULT 0,
  follower_count   INTEGER NOT NULL DEFAULT 0,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_fundraisers_organizer ON fundraisers (organizer_id);
CREATE INDEX IF NOT EXISTS idx_fundraisers_status ON fundraisers (status);
CREATE INDEX IF NOT EXISTS idx_fundraisers_category ON fundraisers (category);
CREATE INDEX IF NOT EXISTS idx_fundraisers_created_at ON fundraisers (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_fundraisers_raised ON fundraisers (raised_cents DESC);
CREATE INDEX IF NOT EXISTS idx_fundraisers_search ON fundraisers USING gin(to_tsvector('english', title || ' ' || story));

-- ─── Platform Events ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS platform_events (
  id           BIGSERIAL PRIMARY KEY,
  event_id     UUID NOT NULL,
  type         TEXT NOT NULL,
  payload      JSONB NOT NULL,
  occurred_at  TIMESTAMPTZ NOT NULL,
  ingested_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (event_id)
);

CREATE INDEX IF NOT EXISTS idx_platform_events_type ON platform_events (type);
CREATE INDEX IF NOT EXISTS idx_platform_events_occurred ON platform_events (occurred_at DESC);

-- ─── Donations ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS donations (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fundraiser_id   UUID NOT NULL REFERENCES fundraisers(id) ON DELETE RESTRICT,
  donor_user_id   UUID REFERENCES users(id) ON DELETE SET NULL,
  amount_cents    INTEGER NOT NULL CHECK (amount_cents > 0),
  tip_cents       INTEGER NOT NULL DEFAULT 0 CHECK (tip_cents >= 0),
  total_cents     INTEGER NOT NULL CHECK (total_cents > 0),
  tip_percent     INTEGER NOT NULL DEFAULT 10,
  is_anonymous    BOOLEAN NOT NULL DEFAULT FALSE,
  message         TEXT,
  event_id        UUID REFERENCES platform_events(event_id) ON DELETE SET NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_donations_fundraiser ON donations (fundraiser_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_donations_donor ON donations (donor_user_id);
CREATE INDEX IF NOT EXISTS idx_donations_event ON donations (event_id);

-- ─── Notifications ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS notifications (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type         TEXT NOT NULL,
  title        TEXT NOT NULL,
  body         TEXT NOT NULL,
  reason_text  TEXT,
  deep_link    TEXT,
  is_read      BOOLEAN NOT NULL DEFAULT FALSE,
  is_bundled   BOOLEAN NOT NULL DEFAULT FALSE,
  bundle_count INTEGER NOT NULL DEFAULT 1,
  source_event_id UUID,
  dedupe_key   TEXT NOT NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, dedupe_key)
);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON notifications (user_id, is_read) WHERE is_read = FALSE;

-- ─── Badges ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS badges (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type         TEXT NOT NULL CHECK (type IN (
                 'trust_pioneer', 'momentum_builder', 'community_champion',
                 'top_donor', 'milestone_reacher'
               )),
  label        TEXT NOT NULL,
  description  TEXT NOT NULL,
  icon         TEXT NOT NULL,
  priority     INTEGER NOT NULL DEFAULT 0,
  earned_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, type)
);

CREATE INDEX IF NOT EXISTS idx_badges_user ON badges (user_id, priority DESC);

-- ─── Follows ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS follows (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  fundraiser_id  UUID NOT NULL REFERENCES fundraisers(id) ON DELETE CASCADE,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (follower_id, fundraiser_id)
);

CREATE INDEX IF NOT EXISTS idx_follows_fundraiser ON follows (fundraiser_id);
CREATE INDEX IF NOT EXISTS idx_follows_follower ON follows (follower_id);

-- ─── Recommendations ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS recommendations (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  fundraiser_id    UUID NOT NULL REFERENCES fundraisers(id) ON DELETE CASCADE,
  score            NUMERIC(6,4) NOT NULL DEFAULT 0,
  interest_match   NUMERIC(6,4) NOT NULL DEFAULT 0,
  donation_sim     NUMERIC(6,4) NOT NULL DEFAULT 0,
  trending_boost   NUMERIC(6,4) NOT NULL DEFAULT 0,
  recency_score    NUMERIC(6,4) NOT NULL DEFAULT 0,
  reasons          JSONB NOT NULL DEFAULT '[]',
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, fundraiser_id)
);

CREATE INDEX IF NOT EXISTS idx_recommendations_user ON recommendations (user_id, score DESC);

-- ─── Charities ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS charities (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organizer_id     UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  name             TEXT NOT NULL,
  description      TEXT NOT NULL,
  ein              TEXT,
  website_url      TEXT,
  logo_url         TEXT,
  fund_allocation  TEXT,
  milestones       JSONB NOT NULL DEFAULT '[]',
  status           TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'suspended')),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_charities_organizer ON charities (organizer_id);

-- ─── Charity Fundraisers (link table) ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS charity_fundraisers (
  charity_id    UUID NOT NULL REFERENCES charities(id) ON DELETE CASCADE,
  fundraiser_id UUID NOT NULL REFERENCES fundraisers(id) ON DELETE CASCADE,
  linked_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (charity_id, fundraiser_id)
);

CREATE INDEX IF NOT EXISTS idx_charity_fundraisers_charity ON charity_fundraisers (charity_id);
CREATE INDEX IF NOT EXISTS idx_charity_fundraisers_fundraiser ON charity_fundraisers (fundraiser_id);

-- ─── Fundraiser Updates ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS fundraiser_updates (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fundraiser_id UUID NOT NULL REFERENCES fundraisers(id) ON DELETE CASCADE,
  title         TEXT NOT NULL,
  body          TEXT NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_fundraiser_updates_fundraiser ON fundraiser_updates (fundraiser_id, created_at DESC);

-- ─── Updated_at trigger ──────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS users_updated_at ON users;
CREATE TRIGGER users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS fundraisers_updated_at ON fundraisers;
CREATE TRIGGER fundraisers_updated_at BEFORE UPDATE ON fundraisers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS charities_updated_at ON charities;
CREATE TRIGGER charities_updated_at BEFORE UPDATE ON charities
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

COMMIT;
