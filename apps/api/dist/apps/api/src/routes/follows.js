"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.followsRoutes = followsRoutes;
const crypto_1 = require("crypto");
const zod_1 = require("zod");
const client_1 = require("../db/client");
const event_ingestion_1 = require("../services/event-ingestion");
const FollowBodySchema = zod_1.z.object({
    followerUserId: zod_1.z.string().uuid(),
    fundraiserId: zod_1.z.string().uuid(),
});
const FollowQuerySchema = zod_1.z.object({
    follower_id: zod_1.z.string().uuid(),
    fundraiser_id: zod_1.z.string().uuid(),
});
async function followsRoutes(app) {
    /** GET /api/follows/status?follower_id=<uuid>&fundraiser_id=<uuid> */
    app.get("/api/follows/status", async (request, reply) => {
        const parse = FollowQuerySchema.safeParse(request.query);
        if (!parse.success) {
            return reply.status(400).send({ error: "Validation failed", details: parse.error.flatten() });
        }
        const { follower_id, fundraiser_id } = parse.data;
        const followResult = await client_1.db.query("SELECT 1 FROM follows WHERE follower_id = $1 AND fundraiser_id = $2 LIMIT 1", [follower_id, fundraiser_id]);
        return reply.send({ isFollowing: followResult.rows.length > 0 });
    });
    /** POST /api/follows */
    app.post("/api/follows", async (request, reply) => {
        const parse = FollowBodySchema.safeParse(request.body);
        if (!parse.success) {
            return reply.status(400).send({ error: "Validation failed", details: parse.error.flatten() });
        }
        const { followerUserId, fundraiserId } = parse.data;
        const [followerResult, fundraiserResult] = await Promise.all([
            client_1.db.query("SELECT id FROM users WHERE id = $1", [followerUserId]),
            client_1.db.query("SELECT id FROM fundraisers WHERE id = $1 AND status = 'active'", [fundraiserId]),
        ]);
        if (followerResult.rowCount === 0) {
            return reply.status(404).send({ error: "Follower user not found" });
        }
        if (fundraiserResult.rowCount === 0) {
            return reply.status(404).send({ error: "Fundraiser not found or not active" });
        }
        const created = await client_1.db.transaction(async (client) => {
            const insertResult = await client.query(`INSERT INTO follows (follower_id, fundraiser_id)
         VALUES ($1, $2)
         ON CONFLICT (follower_id, fundraiser_id) DO NOTHING
         RETURNING id`, [followerUserId, fundraiserId]);
            if (insertResult.rowCount === 0)
                return false;
            await client.query(`UPDATE fundraisers
         SET follower_count = follower_count + 1, updated_at = NOW()
         WHERE id = $1`, [fundraiserId]);
            return true;
        });
        if (created) {
            await (0, event_ingestion_1.insertEvent)({
                eventId: (0, crypto_1.randomUUID)(),
                type: "fundraiser.followed",
                occurredAt: new Date().toISOString(),
                payload: {
                    fundraiserId,
                    followerUserId,
                },
            });
        }
        return reply.status(created ? 201 : 200).send({ isFollowing: true, created });
    });
    /** DELETE /api/follows?follower_id=<uuid>&fundraiser_id=<uuid> */
    app.delete("/api/follows", async (request, reply) => {
        const parse = FollowQuerySchema.safeParse(request.query);
        if (!parse.success) {
            return reply.status(400).send({ error: "Validation failed", details: parse.error.flatten() });
        }
        const { follower_id, fundraiser_id } = parse.data;
        const removed = await client_1.db.transaction(async (client) => {
            const deleteResult = await client.query(`DELETE FROM follows
         WHERE follower_id = $1 AND fundraiser_id = $2
         RETURNING id`, [follower_id, fundraiser_id]);
            if (deleteResult.rowCount === 0)
                return false;
            await client.query(`UPDATE fundraisers
         SET follower_count = GREATEST(follower_count - 1, 0), updated_at = NOW()
         WHERE id = $1`, [fundraiser_id]);
            return true;
        });
        return reply.send({ isFollowing: false, removed });
    });
}
