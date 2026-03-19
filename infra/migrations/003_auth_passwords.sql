-- Add password hashes for first-class account auth

BEGIN;

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS password_hash TEXT;

-- Enforce case-insensitive uniqueness for account emails.
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email_lower_unique
  ON users (LOWER(email));

COMMIT;
