"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.badgesRoutes = badgesRoutes;
const zod_1 = require("zod");
const client_1 = require("../db/client");
const badges_1 = require("../services/badges");
async function badgesRoutes(app) {
    /** POST /api/badges/evaluate */
    app.post("/api/badges/evaluate", async (request, reply) => {
        const schema = zod_1.z.object({ userId: zod_1.z.string().uuid() });
        const parse = schema.safeParse(request.body);
        if (!parse.success) {
            return reply.status(400).send({ error: "Validation failed", details: parse.error.flatten() });
        }
        const { userId } = parse.data;
        const awarded = await (0, badges_1.evaluateAndAwardBadges)(userId);
        const existing = await client_1.db.query("SELECT type FROM badges WHERE user_id = $1", [userId]);
        const eligible = existing.rows.map((row) => row.type);
        return reply.send({ awarded, eligible });
    });
    /** GET /api/badges/:userId */
    app.get("/api/badges/:userId", async (request, reply) => {
        const { userId } = request.params;
        const result = await client_1.db.query(`SELECT id, type, label, description, icon, priority, earned_at
       FROM badges
       WHERE user_id = $1
       ORDER BY priority DESC`, [userId]);
        return reply.send({ badges: result.rows });
    });
}
