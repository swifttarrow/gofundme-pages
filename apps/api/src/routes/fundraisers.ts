import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { db } from "../db/client";

export async function fundraisersRoutes(app: FastifyInstance): Promise<void> {
  /** GET /api/fundraisers?cursor=<iso>&limit=12&category=Medical&sort=trending */
  app.get("/api/fundraisers", async (request: FastifyRequest, reply: FastifyReply) => {
    const query = request.query as {
      cursor?: string;
      limit?: string;
      category?: string;
      sort?: string;
    };

    const limit = Math.min(parseInt(query.limit ?? "12", 10), 48);
    const cursor = query.cursor ? new Date(query.cursor) : new Date();

    let orderBy = "f.created_at DESC";
    if (query.sort === "trending") orderBy = "f.raised_cents DESC";
    if (query.sort === "urgent") orderBy = "f.is_urgent DESC, f.created_at DESC";

    const params: unknown[] = [cursor, limit];
    let categoryClause = "";
    if (query.category) {
      params.push(query.category);
      categoryClause = `AND f.category = $${params.length}`;
    }

    const result = await db.query(
      `SELECT f.id, f.title, f.cover_image_url, f.goal_cents, f.raised_cents,
              f.category, f.location, f.is_urgent, f.donor_count, f.created_at,
              u.name as organizer_name, u.avatar_url as organizer_avatar
       FROM fundraisers f
       JOIN users u ON u.id = f.organizer_id
       WHERE f.status = 'active' AND f.created_at < $1 ${categoryClause}
       ORDER BY ${orderBy}
       LIMIT $2`,
      params
    );

    return reply.send({
      fundraisers: result.rows,
      nextCursor:
        result.rows.length === limit
          ? result.rows[result.rows.length - 1].created_at
          : null,
    });
  });

  /** GET /api/fundraisers/:id */
  app.get("/api/fundraisers/:id", async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string };

    const [frResult, donationsResult] = await Promise.all([
      db.query(
        `SELECT f.*, u.name as organizer_name, u.avatar_url as organizer_avatar,
                u.bio as organizer_bio, u.location as organizer_location
         FROM fundraisers f
         JOIN users u ON u.id = f.organizer_id
         WHERE f.id = $1`,
        [id]
      ),
      db.query(
        `SELECT d.id, d.amount_cents, d.is_anonymous, d.message, d.created_at,
                u.name as donor_name, u.avatar_url as donor_avatar
         FROM donations d
         LEFT JOIN users u ON u.id = d.donor_user_id
         WHERE d.fundraiser_id = $1
         ORDER BY d.created_at DESC
         LIMIT 10`,
        [id]
      ),
    ]);

    if (frResult.rowCount === 0) {
      return reply.status(404).send({ error: "Fundraiser not found" });
    }

    const fundraiser = frResult.rows[0] as Record<string, unknown>;
    const donations = donationsResult.rows.map((d) => {
      const row = d as Record<string, unknown>;
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
}
