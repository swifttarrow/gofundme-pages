import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { db } from "../db/client";
import { BadgeType, evaluateAndAwardBadges } from "../services/badges";

export async function badgesRoutes(app: FastifyInstance): Promise<void> {
  /** POST /api/badges/evaluate */
  app.post("/api/badges/evaluate", async (request: FastifyRequest, reply: FastifyReply) => {
    const schema = z.object({ userId: z.string().uuid() });
    const parse = schema.safeParse(request.body);
    if (!parse.success) {
      return reply.status(400).send({ error: "Validation failed", details: parse.error.flatten() });
    }

    const { userId } = parse.data;
    const awarded = await evaluateAndAwardBadges(userId);
    const existing = await db.query<{ type: BadgeType }>(
      "SELECT type FROM badges WHERE user_id = $1",
      [userId]
    );
    const eligible = existing.rows.map((row) => row.type);

    return reply.send({ awarded, eligible });
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
