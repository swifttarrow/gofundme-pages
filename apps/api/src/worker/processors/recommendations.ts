import { Job } from "bullmq";
import { PlatformEvent } from "@gosupportme/contracts";
import { db } from "../../db/client";
interface RecommendationJob {
  event: PlatformEvent;
}

export async function processRecommendation(job: Job<RecommendationJob>): Promise<void> {
  const { event } = job.data;

  switch (event.type) {
    case "donation.created":
      await handleDonationSignal(event);
      break;
    case "fundraiser.followed":
      await handleFollowSignal(event);
      break;
    default:
      break;
  }
}

async function handleDonationSignal(
  event: PlatformEvent & { type: "donation.created" }
): Promise<void> {
  const { fundraiserId, donorUserId, amountCents } = event.payload;
  if (!donorUserId) return;

  // Update trending_boost for the fundraiser based on recent donation velocity
  const recentDonations = await db.query(
    `SELECT COUNT(*) as cnt, SUM(amount_cents) as total
     FROM donations
     WHERE fundraiser_id = $1 AND created_at > NOW() - INTERVAL '24 hours'`,
    [fundraiserId]
  );

  const donationCount = parseInt(recentDonations.rows[0].cnt);
  const trendingBoost = Math.min(donationCount / 100, 1.0); // Normalize 0-1

  // Update donation_similarity signal: users who donated to same fundraiser
  const codonors = await db.query(
    `SELECT DISTINCT donor_user_id
     FROM donations
     WHERE fundraiser_id = $1 AND donor_user_id IS NOT NULL AND donor_user_id != $2
     LIMIT 50`,
    [fundraiserId, donorUserId]
  );

  // For each co-donor, boost recommendations of fundraisers they've given to
  for (const codonor of codonors.rows) {
    const codonorFundraisers = await db.query(
      `SELECT DISTINCT fundraiser_id FROM donations WHERE donor_user_id = $1`,
      [codonor.donor_user_id]
    );

    for (const fr of codonorFundraisers.rows) {
      if (fr.fundraiser_id === fundraiserId) continue;

      await upsertRecommendation({
        userId: donorUserId,
        fundraiserId: fr.fundraiser_id,
        donationSim: 0.3,
        trendingBoost,
        reasons: [
          { type: "donation_similarity", label: "Donors like you gave to this" },
        ],
      });
    }
  }

  // Also boost the current fundraiser's trending score for all followers
  await db.query(
    `UPDATE recommendations
     SET trending_boost = LEAST(trending_boost + 0.05, 1.0),
         score = (interest_match * 0.4 + donation_sim * 0.3 + LEAST(trending_boost + 0.05, 1.0) * 0.2 + recency_score * 0.1),
         updated_at = NOW()
     WHERE fundraiser_id = $1`,
    [fundraiserId]
  );
}

async function handleFollowSignal(
  event: PlatformEvent & { type: "fundraiser.followed" }
): Promise<void> {
  const { fundraiserId, followerUserId } = event.payload;

  // When someone follows, boost interest_match for similar category fundraisers
  const frResult = await db.query(
    "SELECT category FROM fundraisers WHERE id = $1",
    [fundraiserId]
  );
  if (frResult.rowCount === 0) return;

  const { category } = frResult.rows[0];
  const recencyScore = 1.0 - Math.min(0, 0); // Max recency since just followed

  // Find similar fundraisers in same category
  const similar = await db.query(
    `SELECT id FROM fundraisers
     WHERE category = $1 AND id != $2 AND status = 'active'
     ORDER BY raised_cents DESC
     LIMIT 10`,
    [category, fundraiserId]
  );

  for (const fr of similar.rows) {
    await upsertRecommendation({
      userId: followerUserId,
      fundraiserId: fr.id,
      interestMatch: 0.4,
      recencyScore,
      reasons: [
        { type: "interest_match", label: `Because you follow ${category} causes` },
      ],
    });
  }
}

interface UpsertRecommendationData {
  userId: string;
  fundraiserId: string;
  interestMatch?: number;
  donationSim?: number;
  trendingBoost?: number;
  recencyScore?: number;
  reasons: Array<{ type: string; label: string }>;
}

async function upsertRecommendation(data: UpsertRecommendationData): Promise<void> {
  const im = data.interestMatch ?? 0;
  const ds = data.donationSim ?? 0;
  const tb = data.trendingBoost ?? 0;
  const rs = data.recencyScore ?? 0;
  const score = im * 0.4 + ds * 0.3 + tb * 0.2 + rs * 0.1;

  await db.query(
    `INSERT INTO recommendations (user_id, fundraiser_id, score, interest_match, donation_sim, trending_boost, recency_score, reasons)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     ON CONFLICT (user_id, fundraiser_id) DO UPDATE SET
       score = GREATEST(recommendations.score, EXCLUDED.score),
       interest_match = GREATEST(recommendations.interest_match, EXCLUDED.interest_match),
       donation_sim = GREATEST(recommendations.donation_sim, EXCLUDED.donation_sim),
       trending_boost = GREATEST(recommendations.trending_boost, EXCLUDED.trending_boost),
       recency_score = GREATEST(recommendations.recency_score, EXCLUDED.recency_score),
       reasons = EXCLUDED.reasons,
       updated_at = NOW()`,
    [
      data.userId,
      data.fundraiserId,
      score,
      im,
      ds,
      tb,
      rs,
      JSON.stringify(data.reasons),
    ]
  );
}
