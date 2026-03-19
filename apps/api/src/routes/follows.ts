import { randomUUID } from "crypto";
import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { db } from "../db/client";
import { insertEvent } from "../services/event-ingestion";

const FollowBodySchema = z.object({
  followerUserId: z.string().uuid(),
  fundraiserId: z.string().uuid(),
});

const FollowQuerySchema = z.object({
  follower_id: z.string().uuid(),
  fundraiser_id: z.string().uuid(),
});

const FollowListQuerySchema = z.object({
  follower_id: z.string().uuid(),
});

export async function followsRoutes(app: FastifyInstance): Promise<void> {
  /** GET /api/follows/status?follower_id=<uuid>&fundraiser_id=<uuid> */
  app.get("/api/follows/status", async (request: FastifyRequest, reply: FastifyReply) => {
    const parse = FollowQuerySchema.safeParse(request.query);
    if (!parse.success) {
      return reply.status(400).send({ error: "Validation failed", details: parse.error.flatten() });
    }

    const { follower_id, fundraiser_id } = parse.data;

    const followResult = await db.query(
      "SELECT 1 FROM follows WHERE follower_id = $1 AND fundraiser_id = $2 LIMIT 1",
      [follower_id, fundraiser_id]
    );

    return reply.send({ isFollowing: followResult.rows.length > 0 });
  });

  /** GET /api/follows?follower_id=<uuid> */
  app.get("/api/follows", async (request: FastifyRequest, reply: FastifyReply) => {
    const parse = FollowListQuerySchema.safeParse(request.query);
    if (!parse.success) {
      return reply.status(400).send({ error: "Validation failed", details: parse.error.flatten() });
    }

    const { follower_id } = parse.data;

    const result = await db.query<{
      id: string;
      name: string;
      bio: string | null;
      avatarUrl: string | null;
      location: string | null;
      followerCount: number | string | null;
      fundraiserCount: number | string | null;
    }>(
      `SELECT
         u.id,
         u.name,
         u.bio,
         u.avatar_url AS "avatarUrl",
         u.location,
         COUNT(DISTINCT fo2.follower_id) AS "followerCount",
         COUNT(DISTINCT fr2.id) AS "fundraiserCount"
       FROM follows fo
       JOIN fundraisers fr ON fr.id = fo.fundraiser_id
       JOIN users u ON u.id = fr.organizer_id
       LEFT JOIN fundraisers fr2 ON fr2.organizer_id = u.id AND fr2.status = 'active'
       LEFT JOIN follows fo2 ON fo2.fundraiser_id = fr2.id
       WHERE fo.follower_id = $1
         AND fr.organizer_id <> $1
       GROUP BY u.id, u.name, u.bio, u.avatar_url, u.location
       ORDER BY u.name ASC`,
      [follower_id]
    );

    return reply.send({
      followedUsers: result.rows.map((row) => ({
        id: row.id,
        name: row.name,
        bio: row.bio,
        avatarUrl: row.avatarUrl,
        location: row.location,
        followerCount: Number(row.followerCount ?? 0),
        fundraiserCount: Number(row.fundraiserCount ?? 0),
      })),
    });
  });

  /** POST /api/follows */
  app.post("/api/follows", async (request: FastifyRequest, reply: FastifyReply) => {
    const parse = FollowBodySchema.safeParse(request.body);
    if (!parse.success) {
      return reply.status(400).send({ error: "Validation failed", details: parse.error.flatten() });
    }

    const { followerUserId, fundraiserId } = parse.data;

    const [followerResult, fundraiserResult] = await Promise.all([
      db.query("SELECT id FROM users WHERE id = $1", [followerUserId]),
      db.query("SELECT id FROM fundraisers WHERE id = $1 AND status = 'active'", [fundraiserId]),
    ]);

    if (followerResult.rowCount === 0) {
      return reply.status(404).send({ error: "Follower user not found" });
    }
    if (fundraiserResult.rowCount === 0) {
      return reply.status(404).send({ error: "Fundraiser not found or not active" });
    }

    const created = await db.transaction(async (client) => {
      const insertResult = await client.query(
        `INSERT INTO follows (follower_id, fundraiser_id)
         VALUES ($1, $2)
         ON CONFLICT (follower_id, fundraiser_id) DO NOTHING
         RETURNING id`,
        [followerUserId, fundraiserId]
      );

      if (insertResult.rowCount === 0) return false;

      await client.query(
        `UPDATE fundraisers
         SET follower_count = follower_count + 1, updated_at = NOW()
         WHERE id = $1`,
        [fundraiserId]
      );

      return true;
    });

    if (created) {
      await insertEvent({
        eventId: randomUUID(),
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
  app.delete("/api/follows", async (request: FastifyRequest, reply: FastifyReply) => {
    const parse = FollowQuerySchema.safeParse(request.query);
    if (!parse.success) {
      return reply.status(400).send({ error: "Validation failed", details: parse.error.flatten() });
    }

    const { follower_id, fundraiser_id } = parse.data;

    const removed = await db.transaction(async (client) => {
      const deleteResult = await client.query(
        `DELETE FROM follows
         WHERE follower_id = $1 AND fundraiser_id = $2
         RETURNING id`,
        [follower_id, fundraiser_id]
      );

      if (deleteResult.rowCount === 0) return false;

      await client.query(
        `UPDATE fundraisers
         SET follower_count = GREATEST(follower_count - 1, 0), updated_at = NOW()
         WHERE id = $1`,
        [fundraiser_id]
      );

      return true;
    });

    return reply.send({ isFollowing: false, removed });
  });
}
