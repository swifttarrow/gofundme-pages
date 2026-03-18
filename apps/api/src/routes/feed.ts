import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { db } from "../db/client";

export async function feedRoutes(app: FastifyInstance): Promise<void> {
  /** GET /api/feed?category=Medical&sort=trending|recent|urgent&cursor=<iso>&limit=20 */
  app.get("/api/feed", async (request: FastifyRequest, reply: FastifyReply) => {
    const query = request.query as {
      category?: string;
      sort?: string;
      cursor?: string;
      limit?: string;
    };

    const limit = Math.min(parseInt(query.limit ?? "20", 10), 48);
    const cursor = query.cursor ? new Date(query.cursor) : new Date();

    const params: unknown[] = [cursor, limit];
    let categoryClause = "";
    if (query.category && query.category !== "all") {
      params.push(query.category);
      categoryClause = `AND f.category = $${params.length}`;
    }

    let urgentClause = "";
    if (query.sort === "urgent") {
      urgentClause = "AND f.is_urgent = TRUE";
    }

    let orderBy = "f.created_at DESC";
    if (query.sort === "trending") {
      orderBy = "f.raised_cents DESC, f.donor_count DESC";
    } else if (query.sort === "urgent") {
      orderBy = "f.created_at DESC";
    }

    const result = await db.query(
      `SELECT
         f.id, f.title, f.cover_image_url, f.goal_cents, f.raised_cents,
         f.category, f.location, f.is_urgent, f.donor_count, f.follower_count,
         f.created_at, f.updated_at,
         u.name as organizer_name, u.avatar_url as organizer_avatar,
         ROUND(f.raised_cents::numeric / NULLIF(f.goal_cents, 0) * 100) as progress_percent
       FROM fundraisers f
       JOIN users u ON u.id = f.organizer_id
       WHERE f.status = 'active' AND f.created_at < $1
         ${categoryClause}
         ${urgentClause}
       ORDER BY ${orderBy}
       LIMIT $2`,
      params
    );

    return reply.send({
      items: result.rows,
      nextCursor:
        result.rows.length === limit
          ? result.rows[result.rows.length - 1].created_at
          : null,
    });
  });

  /** GET /api/feed/communities — sidebar communities */
  app.get("/api/feed/communities", async (_request: FastifyRequest, reply: FastifyReply) => {
    // Static communities data (could be dynamic later)
    return reply.send({
      communities: [
        { id: "1", name: "Oakland Mutual Aid", members: 1840 },
        { id: "2", name: "SF Housing Support", members: 2310 },
        { id: "3", name: "Peninsula Parents Network", members: 1245 },
      ],
    });
  });
}
