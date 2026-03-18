-- Charity requests lifecycle for milestones 12-14
BEGIN;

CREATE TABLE IF NOT EXISTS charity_requests (
  id                     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  charity_name           TEXT NOT NULL,
  mission                TEXT NOT NULL,
  beneficiaries          TEXT NOT NULL,
  fund_usage             TEXT NOT NULL,
  location               TEXT NOT NULL,
  cover_image_url        TEXT,
  status                 TEXT NOT NULL DEFAULT 'under_review' CHECK (status IN ('under_review', 'approved', 'rejected')),
  decision_reason        TEXT,
  reviewed_by            UUID REFERENCES users(id) ON DELETE SET NULL,
  reviewed_at            TIMESTAMPTZ,
  idempotency_key        TEXT NOT NULL,
  suspicious_content     BOOLEAN NOT NULL DEFAULT FALSE,
  identity_check_needed  BOOLEAN NOT NULL DEFAULT FALSE,
  first_donation_at      TIMESTAMPTZ,
  created_at             TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at             TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, idempotency_key)
);

-- One under-review request at a time per creator
CREATE UNIQUE INDEX IF NOT EXISTS uq_charity_requests_under_review_per_user
  ON charity_requests (user_id)
  WHERE status = 'under_review';

CREATE INDEX IF NOT EXISTS idx_charity_requests_user_updated
  ON charity_requests (user_id, updated_at DESC);

CREATE INDEX IF NOT EXISTS idx_charity_requests_status_created
  ON charity_requests (status, created_at ASC);

DROP TRIGGER IF EXISTS charity_requests_updated_at ON charity_requests;
CREATE TRIGGER charity_requests_updated_at
  BEFORE UPDATE ON charity_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

COMMIT;
