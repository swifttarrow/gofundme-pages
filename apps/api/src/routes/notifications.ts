import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { db } from "../db/client";

export async function notificationsRoutes(app: FastifyInstance): Promise<void> {
  /** GET /api/notifications?user_id=<uuid>&tab=all|fundraisers|donations|community|archived */
  app.get("/api/notifications", async (request: FastifyRequest, reply: FastifyReply) => {
    const query = request.query as {
      user_id?: string;
      tab?: string;
      limit?: string;
      cursor?: string;
    };

    if (!query.user_id) {
      return reply.status(400).send({ error: "user_id is required" });
    }

    const limit = Math.min(parseInt(query.limit ?? "20", 10), 100);
    const cursor = query.cursor ? new Date(query.cursor) : new Date();

    const tabFilters: Record<string, string> = {
      fundraisers: "AND n.type IN ('fundraiser_update', 'fundraiser_milestone')",
      donations: "AND n.type IN ('donation_received', 'donation_milestone')",
      community: "AND n.type IN ('community_activity', 'follow_activity')",
      archived: "AND n.is_read = TRUE",
    };

    const tabClause = tabFilters[query.tab ?? "all"] ?? "";

    const result = await db.query(
      `SELECT * FROM notifications
       WHERE user_id = $1 AND created_at < $2 ${tabClause}
       ORDER BY created_at DESC
       LIMIT $3`,
      [query.user_id, cursor, limit]
    );

    return reply.send({
      notifications: result.rows,
      nextCursor:
        result.rows.length === limit
          ? result.rows[result.rows.length - 1].created_at
          : null,
    });
  });

  /** PATCH /api/notifications/:id/read */
  app.patch(
    "/api/notifications/:id/read",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { id } = request.params as { id: string };
      const { user_id } = request.body as { user_id?: string };

      if (!user_id) {
        return reply.status(400).send({ error: "user_id is required" });
      }

      const result = await db.query(
        `UPDATE notifications SET is_read = TRUE
         WHERE id = $1 AND user_id = $2
         RETURNING id`,
        [id, user_id]
      );

      if (result.rowCount === 0) {
        return reply.status(404).send({ error: "Notification not found" });
      }

      return reply.send({ id, read: true });
    }
  );

  /** PATCH /api/notifications/mark-all-read */
  app.patch(
    "/api/notifications/mark-all-read",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { user_id } = request.body as { user_id?: string };
      if (!user_id) return reply.status(400).send({ error: "user_id is required" });

      await db.query(
        "UPDATE notifications SET is_read = TRUE WHERE user_id = $1",
        [user_id]
      );

      return reply.send({ success: true });
    }
  );

  /** POST /api/notifications/preview — debug/preview for given event */
  app.post(
    "/api/notifications/preview",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const schema = z.object({
        userId: z.string().uuid(),
        eventType: z.string(),
        eventPayload: z.record(z.unknown()),
      });

      const parse = schema.safeParse(request.body);
      if (!parse.success) {
        return reply.status(400).send({ error: "Validation failed", details: parse.error.flatten() });
      }

      const { eventType, eventPayload } = parse.data;

      // Generate a preview notification without persisting
      const preview = generateNotificationPreview(eventType, eventPayload);
      return reply.send({ preview });
    }
  );
}

function generateNotificationPreview(
  eventType: string,
  payload: Record<string, unknown>
): Record<string, unknown> {
  switch (eventType) {
    case "donation.created":
      return {
        type: "donation_received",
        title: `New donation of $${((payload.amountCents as number) / 100).toFixed(2)}`,
        body: "Someone donated to a fundraiser you follow",
        reasonText: "Because you follow this fundraiser",
        deepLink: `/fundraiser/${payload.fundraiserId}`,
      };
    case "fundraiser.update_posted":
      return {
        type: "fundraiser_update",
        title: payload.title as string,
        body: payload.bodySnippet as string,
        reasonText: "Because you follow this fundraiser",
        deepLink: `/fundraiser/${payload.fundraiserId}`,
      };
    default:
      return {
        type: eventType,
        title: "New activity",
        body: "Something happened on a fundraiser you follow",
        reasonText: "Because you follow this fundraiser",
        deepLink: "/notifications",
      };
  }
}
