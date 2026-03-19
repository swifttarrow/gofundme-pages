"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fundraisersRoutes = fundraisersRoutes;
const zod_1 = require("zod");
const client_1 = require("../db/client");
const PublishFundraiserSchema = zod_1.z.object({
    organizerId: zod_1.z.string().uuid(),
    title: zod_1.z.string().trim().min(3).max(80),
    summary: zod_1.z.string().trim().min(3).max(1500),
    story: zod_1.z.string().trim().min(10).max(12000),
    goalAmountCents: zod_1.z.number().int().positive(),
    category: zod_1.z.string().trim().min(2).max(80),
    location: zod_1.z.string().trim().min(2).max(120),
    breakdown: zod_1.z.array(zod_1.z.string().trim().min(2).max(300)).default([]),
    coverImageUrl: zod_1.z.string().url().max(2000000).optional(),
    distribution: zod_1.z
        .object({
        shareToCommunity: zod_1.z.boolean(),
        notifyFriends: zod_1.z.boolean(),
    })
        .default({ shareToCommunity: true, notifyFriends: false }),
});
async function fundraisersRoutes(app) {
    /** GET /api/fundraisers?cursor=<iso>&limit=12&category=Medical&sort=trending */
    app.get("/api/fundraisers", async (request, reply) => {
        const query = request.query;
        const limit = Math.min(parseInt(query.limit ?? "12", 10), 48);
        const cursor = query.cursor ? new Date(query.cursor) : new Date();
        let orderBy = "f.created_at DESC";
        if (query.sort === "trending")
            orderBy = "f.raised_cents DESC";
        if (query.sort === "urgent")
            orderBy = "f.is_urgent DESC, f.created_at DESC";
        const params = [cursor, limit];
        let categoryClause = "";
        if (query.category) {
            params.push(query.category);
            categoryClause = `AND f.category = $${params.length}`;
        }
        const result = await client_1.db.query(`SELECT f.id, f.title, f.cover_image_url, f.goal_cents, f.raised_cents,
              f.category, f.location, f.is_urgent, f.donor_count, f.created_at,
              u.name as organizer_name, u.avatar_url as organizer_avatar
       FROM fundraisers f
       JOIN users u ON u.id = f.organizer_id
       WHERE f.status = 'active' AND f.created_at < $1 ${categoryClause}
       ORDER BY ${orderBy}
       LIMIT $2`, params);
        return reply.send({
            fundraisers: result.rows,
            nextCursor: result.rows.length === limit
                ? result.rows[result.rows.length - 1].created_at
                : null,
        });
    });
    /** GET /api/fundraisers/:id */
    app.get("/api/fundraisers/:id", async (request, reply) => {
        const { id } = request.params;
        const [frResult, donationsResult] = await Promise.all([
            client_1.db.query(`SELECT f.*, u.name as organizer_name, u.avatar_url as organizer_avatar,
                u.bio as organizer_bio, u.location as organizer_location
         FROM fundraisers f
         JOIN users u ON u.id = f.organizer_id
         WHERE f.id = $1`, [id]),
            client_1.db.query(`SELECT d.id, d.donor_user_id, d.amount_cents, d.is_anonymous, d.message, d.created_at,
                u.name as donor_name, u.avatar_url as donor_avatar
         FROM donations d
         LEFT JOIN users u ON u.id = d.donor_user_id
         WHERE d.fundraiser_id = $1
         ORDER BY d.created_at DESC
         LIMIT 10`, [id]),
        ]);
        if (frResult.rowCount === 0) {
            return reply.status(404).send({ error: "Fundraiser not found" });
        }
        const fundraiser = frResult.rows[0];
        const donations = donationsResult.rows.map((d) => {
            const row = d;
            return {
                ...row,
                donor_name: row.is_anonymous ? "Anonymous" : (row.donor_name ?? "Anonymous"),
                donor_avatar: row.is_anonymous ? null : row.donor_avatar,
            };
        });
        const goalCents = Number(fundraiser.goal_cents ?? 0);
        const raisedCents = Number(fundraiser.raised_cents ?? 0);
        const progressPercent = goalCents > 0 ? Math.round((raisedCents / goalCents) * 100) : 0;
        return reply.send({
            ...fundraiser,
            progressPercent,
            recentDonations: donations,
        });
    });
    /** POST /api/fundraisers */
    app.post("/api/fundraisers", async (request, reply) => {
        const parse = PublishFundraiserSchema.safeParse(request.body);
        if (!parse.success) {
            return reply.status(400).send({ error: "Validation failed", details: parse.error.flatten() });
        }
        const data = parse.data;
        const insert = await client_1.db.query(`INSERT INTO fundraisers (
         organizer_id, title, story, cover_image_url, goal_cents, category, location, status
       )
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'active')
       RETURNING id, title, story, cover_image_url, goal_cents, category, location, status, created_at`, [
            data.organizerId,
            data.title,
            `${data.summary}\n\n${data.story}\n\n${data.breakdown.map((item) => `- ${item}`).join("\n")}`.trim(),
            data.coverImageUrl ?? null,
            data.goalAmountCents,
            data.category,
            data.location,
        ]);
        const created = insert.rows[0];
        return reply.status(201).send({
            fundraiser: {
                id: created.id,
                title: created.title,
                story: created.story,
                coverImageUrl: created.cover_image_url,
                goalAmountCents: created.goal_cents,
                category: created.category,
                location: created.location,
                status: created.status,
                createdAt: created.created_at,
            },
            distribution: data.distribution,
            shareUrl: `/fundraiser/${created.id}`,
        });
    });
}
