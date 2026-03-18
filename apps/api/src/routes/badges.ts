import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { db } from "../db/client";

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

type BadgeType = (typeof BADGE_DEFINITIONS)[number]["type"];

export async function badgesRoutes(app: FastifyInstance): Promise<void> {
  /** POST /api/badges/evaluate */
  app.post("/api/badges/evaluate", async (request: FastifyRequest, reply: FastifyReply) => {
    const schema = z.object({ userId: z.string().uuid() });
    const parse = schema.safeParse(request.body);
    if (!parse.success) {
      return reply.status(400).send({ error: "Validation failed", details: parse.error.flatten() });
    }

    const { userId } = parse.data;
    const awarded: string[] = [];

    // Fetch user's fundraiser stats
    const [fundraiserStats, donationStats] = await Promise.all([
      db.query(
        `SELECT
           COUNT(*) as fundraiser_count,
           SUM(donor_count) as total_donors,
           MAX(CASE WHEN raised_cents >= goal_cents THEN 1 ELSE 0 END) as has_completed,
           MAX(CASE WHEN
             raised_cents::float / NULLIF(goal_cents, 0) >= 0.5
             AND created_at > NOW() - INTERVAL '48 hours'
           THEN 1 ELSE 0 END) as has_momentum
         FROM fundraisers
         WHERE organizer_id = $1 AND status = 'active'`,
        [userId]
      ),
      db.query(
        "SELECT COUNT(*) as donation_count FROM donations WHERE donor_user_id = $1",
        [userId]
      ),
    ]);

    const fs = fundraiserStats.rows[0] as Record<string, unknown>;
    const ds = donationStats.rows[0] as Record<string, unknown>;

    const eligibleBadges: BadgeType[] = [];

    if (parseInt(String(fs.fundraiser_count ?? "0")) > 0) {
      eligibleBadges.push("trust_pioneer");
    }
    if (parseInt(String(fs.has_momentum ?? "0")) > 0) {
      eligibleBadges.push("momentum_builder");
    }
    if (parseInt(String(fs.total_donors ?? "0")) >= 500) {
      eligibleBadges.push("community_champion");
    }
    if (parseInt(String(ds.donation_count ?? "0")) >= 10) {
      eligibleBadges.push("top_donor");
    }
    if (parseInt(String(fs.has_completed ?? "0")) > 0) {
      eligibleBadges.push("milestone_reacher");
    }

    // Idempotent insert
    for (const badgeType of eligibleBadges) {
      const def = BADGE_DEFINITIONS.find((b) => b.type === badgeType)!;
      const result = await db.query(
        `INSERT INTO badges (user_id, type, label, description, icon, priority)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (user_id, type) DO NOTHING
         RETURNING type`,
        [userId, def.type, def.label, def.description, def.icon, def.priority]
      );
      if (result.rowCount && result.rowCount > 0) {
        awarded.push(badgeType);
      }
    }

    return reply.send({ awarded, eligible: eligibleBadges });
  });

  /** GET /api/badges/:userId */
  app.get("/api/badges/:userId", async (request: FastifyRequest, reply: FastifyReply) => {
    const { userId } = request.params as { userId: string };

    const result = await db.query(
      `SELECT id, type, label, description, icon, priority, earned_at
       FROM badges
       WHERE user_id = $1
       ORDER BY priority DESC`,
      [userId]
    );

    return reply.send({ badges: result.rows });
  });
}
