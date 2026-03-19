"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.recommendationsRoutes = recommendationsRoutes;
const client_1 = require("../db/client");
async function recommendationsRoutes(app) {
    /** GET /api/recommendations?user_id=<uuid>&limit=12 */
    app.get("/api/recommendations", async (request, reply) => {
        const query = request.query;
        if (!query.user_id) {
            return reply.status(400).send({ error: "user_id is required" });
        }
        const limit = Math.min(parseInt(query.limit ?? "12", 10), 48);
        const explorationSlots = Math.max(1, Math.floor(limit * 0.15));
        const mainSlots = limit - explorationSlots;
        // Main heuristic recommendations from precomputed table
        const mainResult = await client_1.db.query(`SELECT r.fundraiser_id, r.score, r.interest_match, r.donation_sim,
              r.trending_boost, r.recency_score, r.reasons,
              f.title, f.cover_image_url, f.goal_cents, f.raised_cents, f.category, f.donor_count
       FROM recommendations r
       JOIN fundraisers f ON f.id = r.fundraiser_id
       WHERE r.user_id = $1 AND f.status = 'active'
       ORDER BY r.score DESC
       LIMIT $2`, [query.user_id, mainSlots]);
        // 15% exploration: random eligible campaigns the user hasn't seen
        const seenIds = mainResult.rows.map((r) => r.fundraiser_id);
        const explorationResult = await client_1.db.query(`SELECT f.id, f.title, f.cover_image_url, f.goal_cents, f.raised_cents, f.category, f.donor_count
       FROM fundraisers f
       WHERE f.status = 'active'
         AND f.id != ALL($1)
       ORDER BY RANDOM()
       LIMIT $2`, [seenIds.length > 0 ? seenIds : ["00000000-0000-0000-0000-000000000000"], explorationSlots]);
        const mainRecs = mainResult.rows.map((r) => ({
            fundraiserId: r.fundraiser_id,
            score: parseFloat(r.score),
            reasons: Array.isArray(r.reasons) ? r.reasons : [],
            fundraiser: {
                title: r.title,
                coverImageUrl: r.cover_image_url,
                goalCents: r.goal_cents,
                raisedCents: r.raised_cents,
                category: r.category,
                donorCount: r.donor_count,
            },
        }));
        const explorationRecs = explorationResult.rows.map((f) => ({
            fundraiserId: f.id,
            score: 0,
            reasons: [{ type: "exploration", label: "Explore something new" }],
            fundraiser: {
                title: f.title,
                coverImageUrl: f.cover_image_url,
                goalCents: f.goal_cents,
                raisedCents: f.raised_cents,
                category: f.category,
                donorCount: f.donor_count,
            },
        }));
        return reply.send({
            recommendations: [...mainRecs, ...explorationRecs],
            meta: { mainSlots, explorationSlots },
        });
    });
}
