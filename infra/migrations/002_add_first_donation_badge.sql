BEGIN;

ALTER TABLE badges
  DROP CONSTRAINT IF EXISTS badges_type_check;

ALTER TABLE badges
  ADD CONSTRAINT badges_type_check CHECK (
    type IN (
      'trust_pioneer',
      'momentum_builder',
      'community_champion',
      'top_donor',
      'first_donation',
      'milestone_reacher'
    )
  );

UPDATE badges
SET label = 'First Fundraiser',
    description = 'Created your first fundraiser on GoSupportMe',
    icon = 'shield-check',
    priority = 100
WHERE type = 'trust_pioneer';

UPDATE badges
SET label = 'Influencer',
    description = 'Fundraiser reached 500+ donors',
    icon = 'users',
    priority = 80
WHERE type = 'community_champion';

COMMIT;
