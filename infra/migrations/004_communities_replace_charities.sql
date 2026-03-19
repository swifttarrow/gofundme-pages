BEGIN;

-- Replace charities domain tables with communities while preserving data.
DO $$
DECLARE
  communities_has_organizer_id BOOLEAN;
  comm_reg regclass;
  char_reg regclass;
BEGIN
  comm_reg := to_regclass('public.communities');
  char_reg := to_regclass('public.charities');

  -- Check if existing communities table has the canonical schema (from charities)
  IF comm_reg IS NOT NULL THEN
    SELECT EXISTS (
      SELECT 1
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = 'communities'
        AND column_name = 'organizer_id'
    ) INTO communities_has_organizer_id;

    -- If a legacy/non-canonical communities table exists, drop it so charities can become canonical communities.
    IF NOT communities_has_organizer_id THEN
      DROP TABLE IF EXISTS communities CASCADE;
      comm_reg := NULL;
    END IF;
  END IF;

  IF comm_reg IS NULL AND char_reg IS NOT NULL THEN
    ALTER TABLE charities RENAME TO communities;
  ELSIF comm_reg IS NOT NULL AND char_reg IS NOT NULL THEN
    INSERT INTO communities (
      id, organizer_id, name, description, ein, website_url, logo_url, fund_allocation,
      milestones, status, created_at, updated_at
    )
    SELECT
      c.id, c.organizer_id, c.name, c.description, c.ein, c.website_url, c.logo_url, c.fund_allocation,
      c.milestones, c.status, c.created_at, c.updated_at
    FROM charities c
    WHERE NOT EXISTS (SELECT 1 FROM communities existing WHERE existing.id = c.id);

    DROP TABLE charities CASCADE;
  END IF;
END $$;

DO $$
DECLARE
  link_has_community_id BOOLEAN;
  link_has_charity_id BOOLEAN;
  cf_reg regclass;
  cm_reg regclass;
BEGIN
  cf_reg := to_regclass('public.charity_fundraisers');
  cm_reg := to_regclass('public.community_fundraisers');

  IF cm_reg IS NOT NULL THEN
    SELECT EXISTS (
      SELECT 1
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = 'community_fundraisers'
        AND column_name = 'community_id'
    ) INTO link_has_community_id;

    SELECT EXISTS (
      SELECT 1
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = 'community_fundraisers'
        AND column_name = 'charity_id'
    ) INTO link_has_charity_id;

    IF NOT link_has_community_id AND NOT link_has_charity_id THEN
      DROP TABLE IF EXISTS community_fundraisers CASCADE;
      cm_reg := NULL;
    END IF;
  END IF;

  IF cm_reg IS NULL AND cf_reg IS NOT NULL THEN
    ALTER TABLE charity_fundraisers RENAME TO community_fundraisers;
  ELSIF cm_reg IS NOT NULL AND cf_reg IS NOT NULL THEN
    INSERT INTO community_fundraisers (community_id, fundraiser_id, linked_at)
    SELECT
      cf.charity_id,
      cf.fundraiser_id,
      cf.linked_at
    FROM charity_fundraisers cf
    ON CONFLICT DO NOTHING;

    DROP TABLE charity_fundraisers CASCADE;
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'community_fundraisers'
      AND column_name = 'charity_id'
  ) THEN
    ALTER TABLE community_fundraisers RENAME COLUMN charity_id TO community_id;
  END IF;
END $$;

DROP INDEX IF EXISTS idx_charities_organizer;
DROP INDEX IF EXISTS idx_charity_fundraisers_charity;
DROP INDEX IF EXISTS idx_charity_fundraisers_fundraiser;

-- Only create indexes if the target table and columns exist (defensive for any DB state)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'communities'
      AND column_name = 'organizer_id'
  ) THEN
    CREATE INDEX IF NOT EXISTS idx_communities_organizer ON communities (organizer_id);
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'community_fundraisers'
      AND column_name = 'community_id'
  ) THEN
    CREATE INDEX IF NOT EXISTS idx_community_fundraisers_community ON community_fundraisers (community_id);
  END IF;
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'community_fundraisers'
      AND column_name = 'fundraiser_id'
  ) THEN
    CREATE INDEX IF NOT EXISTS idx_community_fundraisers_fundraiser ON community_fundraisers (fundraiser_id);
  END IF;
END $$;

-- Trigger only if communities table exists
DO $$
BEGIN
  IF to_regclass('public.communities') IS NOT NULL THEN
    DROP TRIGGER IF EXISTS charities_updated_at ON communities;
    DROP TRIGGER IF EXISTS communities_updated_at ON communities;
    CREATE TRIGGER communities_updated_at
      BEFORE UPDATE ON communities
      FOR EACH ROW EXECUTE FUNCTION update_updated_at();
  END IF;
END $$;

COMMIT;
