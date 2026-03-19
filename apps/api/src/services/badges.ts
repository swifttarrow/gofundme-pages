import { PoolClient } from "pg";
import { db } from "../db/client";

export const BADGE_DEFINITIONS = [
  {
    type: "trust_pioneer",
    label: "First Fundraiser",
    description: "Created your first fundraiser on GoSupportMe",
    icon: "shield-check",
    priority: 100,
  },
  {
    type: "momentum_builder",
    label: "Momentum Builder",
    description: "Raised 50% of goal within the first 48 hours",
    icon: "trending-up",
    priority: 90,
  },
  {
    type: "community_champion",
    label: "Influencer",
    description: "Fundraiser reached 500+ donors",
    icon: "users",
    priority: 80,
  },
  {
    type: "top_donor",
    label: "Top Donor",
    description: "Donated to 10 or more fundraisers",
    icon: "heart",
    priority: 70,
  },
  {
    type: "first_donation",
    label: "First Donation",
    description: "Made your first donation on GoSupportMe",
    icon: "gift",
    priority: 65,
  },
  {
    type: "milestone_reacher",
    label: "Milestone Reacher",
    description: "Fundraiser reached its goal",
    icon: "flag",
    priority: 60,
  },
] as const;

export type BadgeDefinition = (typeof BADGE_DEFINITIONS)[number];
export type BadgeType = BadgeDefinition["type"];

interface BadgeStatsRow {
  fundraiser_count: string;
  total_donors: string | null;
  has_completed: string | null;
  has_momentum: string | null;
}

interface DonationStatsRow {
  donation_count: string;
  unique_fundraisers: string;
}

interface EvaluateBadgesOptions {
  sourceEventId?: string;
}

export async function evaluateAndAwardBadges(
  userId: string,
  options: EvaluateBadgesOptions = {}
): Promise<BadgeDefinition[]> {
  const [fundraiserStats, donationStats] = await Promise.all([
    db.query<BadgeStatsRow>(
      `SELECT
         COUNT(*) as fundraiser_count,
         COALESCE(SUM(donor_count), 0) as total_donors,
         MAX(CASE WHEN raised_cents >= goal_cents THEN 1 ELSE 0 END) as has_completed,
         MAX(CASE WHEN
           raised_cents::float / NULLIF(goal_cents, 0) >= 0.5
           AND created_at > NOW() - INTERVAL '48 hours'
         THEN 1 ELSE 0 END) as has_momentum
       FROM fundraisers
       WHERE organizer_id = $1 AND status = 'active'`,
      [userId]
    ),
    db.query<DonationStatsRow>(
      `SELECT
         COUNT(*) as donation_count,
         COUNT(DISTINCT fundraiser_id) as unique_fundraisers
       FROM donations
       WHERE donor_user_id = $1`,
      [userId]
    ),
  ]);

  const fundraiser = fundraiserStats.rows[0];
  const donation = donationStats.rows[0];

  const eligibleBadgeTypes: BadgeType[] = [];

  if (parseInt(fundraiser.fundraiser_count, 10) > 0) {
    eligibleBadgeTypes.push("trust_pioneer");
  }
  if (parseInt(fundraiser.has_momentum ?? "0", 10) > 0) {
    eligibleBadgeTypes.push("momentum_builder");
  }
  if (parseInt(fundraiser.total_donors ?? "0", 10) >= 500) {
    eligibleBadgeTypes.push("community_champion");
  }
  if (parseInt(donation.unique_fundraisers, 10) >= 10) {
    eligibleBadgeTypes.push("top_donor");
  }
  if (parseInt(donation.donation_count, 10) > 0) {
    eligibleBadgeTypes.push("first_donation");
  }
  if (parseInt(fundraiser.has_completed ?? "0", 10) > 0) {
    eligibleBadgeTypes.push("milestone_reacher");
  }

  const awardedBadges = await db.transaction(async (client) => {
    const newlyAwarded: BadgeDefinition[] = [];

    for (const badgeType of eligibleBadgeTypes) {
      const def = BADGE_DEFINITIONS.find((badge) => badge.type === badgeType);
      if (!def) continue;

      const result = await client.query<{ type: BadgeType }>(
        `INSERT INTO badges (user_id, type, label, description, icon, priority)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (user_id, type) DO NOTHING
         RETURNING type`,
        [userId, def.type, def.label, def.description, def.icon, def.priority]
      );

      if ((result.rowCount ?? 0) > 0) {
        newlyAwarded.push(def);
        await insertBadgeNotification(client, userId, def, options.sourceEventId);
      } else {
        await client.query(
          `UPDATE badges
           SET label = $3, description = $4, icon = $5, priority = $6
           WHERE user_id = $1 AND type = $2`,
          [userId, def.type, def.label, def.description, def.icon, def.priority]
        );
      }
    }

    return newlyAwarded;
  });

  return awardedBadges;
}

async function insertBadgeNotification(
  client: PoolClient,
  userId: string,
  badge: BadgeDefinition,
  sourceEventId?: string
): Promise<void> {
  await client.query(
    `INSERT INTO notifications (user_id, type, title, body, reason_text, deep_link, source_event_id, dedupe_key)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     ON CONFLICT (user_id, dedupe_key) DO NOTHING`,
    [
      userId,
      "badge_earned",
      `You earned the "${badge.label}" badge`,
      badge.description,
      "Because of your activity on GoSupportMe",
      `/profile/${userId}`,
      sourceEventId ?? null,
      `badge-earned-${badge.type}`,
    ]
  );
}
