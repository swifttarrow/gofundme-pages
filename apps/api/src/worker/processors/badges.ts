import { Job } from "bullmq";
import { PlatformEvent } from "@gosupportme/contracts";
import { db } from "../../db/client";
import { jobsProcessedTotal } from "../../observability/metrics";

interface BadgeJob {
  event: PlatformEvent;
}

const BADGE_DEFINITIONS = [
  {
    type: "trust_pioneer",
    label: "Trust Pioneer",
    description: "One of the first verified fundraisers on GoSupportMe",
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
    label: "Community Champion",
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
    type: "milestone_reacher",
    label: "Milestone Reacher",
    description: "Fundraiser reached its goal",
    icon: "flag",
    priority: 60,
  },
] as const;

export async function processBadge(job: Job<BadgeJob>): Promise<void> {
  const { event } = job.data;

  const userIds = extractRelevantUserIds(event);

  for (const userId of userIds) {
    try {
      await evaluateAndAwardBadges(userId);
    } catch (err) {
      console.error(`Badge evaluation failed for user ${userId}:`, err);
    }
  }

  jobsProcessedTotal.inc({ queue: "badge-queue", status: "completed" });
}

function extractRelevantUserIds(event: PlatformEvent): string[] {
  switch (event.type) {
    case "donation.created":
      return [
        ...(event.payload.donorUserId ? [event.payload.donorUserId] : []),
      ];
    case "fundraiser.update_posted":
      return [event.payload.organizerUserId];
    case "fundraiser.followed":
      return [event.payload.followerUserId];
    case "profile.updated":
      return [event.payload.userId];
    default:
      return [];
  }
}

async function evaluateAndAwardBadges(userId: string): Promise<void> {
  const [fundraiserStats, donationStats] = await Promise.all([
    db.query(
      `SELECT
         COUNT(*) as fundraiser_count,
         COALESCE(SUM(donor_count), 0) as total_donors,
         MAX(CASE WHEN raised_cents >= goal_cents THEN 1 ELSE 0 END) as has_completed,
         MAX(CASE WHEN
           raised_cents::float / NULLIF(goal_cents, 0) >= 0.5
           AND created_at > NOW() - INTERVAL '48 hours'
         THEN 1 ELSE 0 END) as has_momentum
       FROM fundraisers
       WHERE organizer_id = $1`,
      [userId]
    ),
    db.query(
      "SELECT COUNT(DISTINCT fundraiser_id) as unique_fundraisers FROM donations WHERE donor_user_id = $1",
      [userId]
    ),
  ]);

  const fs = fundraiserStats.rows[0];
  const ds = donationStats.rows[0];

  const eligibleBadges: string[] = [];

  if (parseInt(fs.fundraiser_count) > 0) eligibleBadges.push("trust_pioneer");
  if (parseInt(fs.has_momentum ?? "0") > 0) eligibleBadges.push("momentum_builder");
  if (parseInt(fs.total_donors ?? "0") >= 500) eligibleBadges.push("community_champion");
  if (parseInt(ds.unique_fundraisers) >= 10) eligibleBadges.push("top_donor");
  if (parseInt(fs.has_completed ?? "0") > 0) eligibleBadges.push("milestone_reacher");

  for (const badgeType of eligibleBadges) {
    const def = BADGE_DEFINITIONS.find((b) => b.type === badgeType);
    if (!def) continue;

    await db.query(
      `INSERT INTO badges (user_id, type, label, description, icon, priority)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (user_id, type) DO NOTHING`,
      [userId, def.type, def.label, def.description, def.icon, def.priority]
    );
  }
}
