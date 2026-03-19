"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processRecommendation = processRecommendation;
const client_1 = require("../../db/client");
const metrics_1 = require("../../observability/metrics");
async function processRecommendation(job) {
    const { event } = job.data;
    try {
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
    finally {
        metrics_1.jobsProcessedTotal.inc({ queue: "recommendation-queue", status: "completed" });
    }
}
async function handleDonationSignal(event) {
    const { fundraiserId, donorUserId, amountCents } = event.payload;
    if (!donorUserId)
        return;
    // Update trending_boost for the fundraiser based on recent donation velocity
    const recentDonations = await client_1.db.query(`SELECT COUNT(*) as cnt, SUM(amount_cents) as total
     FROM donations
     WHERE fundraiser_id = $1 AND created_at > NOW() - INTERVAL '24 hours'`, [fundraiserId]);
    const donationCount = parseInt(recentDonations.rows[0].cnt);
    const trendingBoost = Math.min(donationCount / 100, 1.0); // Normalize 0-1
    // Update donation_similarity signal: users who donated to same fundraiser
    const codonors = await client_1.db.query(`SELECT DISTINCT donor_user_id
     FROM donations
     WHERE fundraiser_id = $1 AND donor_user_id IS NOT NULL AND donor_user_id != $2
     LIMIT 50`, [fundraiserId, donorUserId]);
    // For each co-donor, boost recommendations of fundraisers they've given to
    for (const codonor of codonors.rows) {
        const codonorFundraisers = await client_1.db.query(`SELECT DISTINCT fundraiser_id FROM donations WHERE donor_user_id = $1`, [codonor.donor_user_id]);
        for (const fr of codonorFundraisers.rows) {
            if (fr.fundraiser_id === fundraiserId)
                continue;
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
    await client_1.db.query(`UPDATE recommendations
     SET trending_boost = LEAST(trending_boost + 0.05, 1.0),
         score = (interest_match * 0.4 + donation_sim * 0.3 + LEAST(trending_boost + 0.05, 1.0) * 0.2 + recency_score * 0.1),
         updated_at = NOW()
     WHERE fundraiser_id = $1`, [fundraiserId]);
}
async function handleFollowSignal(event) {
    const { fundraiserId, followerUserId } = event.payload;
    // When someone follows, boost interest_match for similar category fundraisers
    const frResult = await client_1.db.query("SELECT category FROM fundraisers WHERE id = $1", [fundraiserId]);
    if (frResult.rowCount === 0)
        return;
    const { category } = frResult.rows[0];
    const recencyScore = 1.0 - Math.min(0, 0); // Max recency since just followed
    // Find similar fundraisers in same category
    const similar = await client_1.db.query(`SELECT id FROM fundraisers
     WHERE category = $1 AND id != $2 AND status = 'active'
     ORDER BY raised_cents DESC
     LIMIT 10`, [category, fundraiserId]);
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
async function upsertRecommendation(data) {
    const im = data.interestMatch ?? 0;
    const ds = data.donationSim ?? 0;
    const tb = data.trendingBoost ?? 0;
    const rs = data.recencyScore ?? 0;
    const score = im * 0.4 + ds * 0.3 + tb * 0.2 + rs * 0.1;
    await client_1.db.query(`INSERT INTO recommendations (user_id, fundraiser_id, score, interest_match, donation_sim, trending_boost, recency_score, reasons)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     ON CONFLICT (user_id, fundraiser_id) DO UPDATE SET
       score = GREATEST(recommendations.score, EXCLUDED.score),
       interest_match = GREATEST(recommendations.interest_match, EXCLUDED.interest_match),
       donation_sim = GREATEST(recommendations.donation_sim, EXCLUDED.donation_sim),
       trending_boost = GREATEST(recommendations.trending_boost, EXCLUDED.trending_boost),
       recency_score = GREATEST(recommendations.recency_score, EXCLUDED.recency_score),
       reasons = EXCLUDED.reasons,
       updated_at = NOW()`, [
        data.userId,
        data.fundraiserId,
        score,
        im,
        ds,
        tb,
        rs,
        JSON.stringify(data.reasons),
    ]);
}
