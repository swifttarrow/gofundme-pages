import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { randomUUID } from "crypto";
import { z } from "zod";
import { db } from "../db/client";
import { insertEvent } from "../services/event-ingestion";

const DonationRequestSchema = z
  .object({
    fundraiserId: z.string().uuid(),
    donorUserId: z.string().uuid().nullable().default(null),
    isAnonymous: z.boolean().default(false),
    message: z.string().max(500).nullable().default(null),
    amountCents: z.number().int().positive(),
    tipCents: z.number().int().nonnegative(),
    totalCents: z.number().int().positive(),
    tipPercent: z.union([
      z.literal(0), z.literal(5), z.literal(10),
      z.literal(15), z.literal(20), z.literal("custom"),
    ]),
  })
  .refine((d) => d.totalCents === d.amountCents + d.tipCents, {
    message: "totalCents must equal amountCents + tipCents",
    path: ["totalCents"],
  });

export async function donationsRoutes(app: FastifyInstance): Promise<void> {
  /** POST /api/donations */
  app.post("/api/donations", async (request: FastifyRequest, reply: FastifyReply) => {
    const parse = DonationRequestSchema.safeParse(request.body);
    if (!parse.success) {
      return reply.status(400).send({ error: "Validation failed", details: parse.error.flatten() });
    }

    const data = parse.data;

    // Server-side integer math check (belt-and-suspenders)
    if (data.totalCents !== data.amountCents + data.tipCents) {
      return reply.status(400).send({ error: "totalCents must equal amountCents + tipCents" });
    }

    // Check fundraiser exists
    const fr = await db.query(
      "SELECT id FROM fundraisers WHERE id = $1 AND status = 'active'",
      [data.fundraiserId]
    );
    if (fr.rowCount === 0) {
      return reply.status(404).send({ error: "Fundraiser not found or not active" });
    }

    const donationId = randomUUID();
    const eventId = randomUUID();
    const now = new Date().toISOString();

    // Insert donation + emit event in a transaction
    await db.transaction(async (client) => {
      await client.query(
        `INSERT INTO donations (id, fundraiser_id, donor_user_id, amount_cents, tip_cents, total_cents, tip_percent, is_anonymous, message, event_id)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
        [
          donationId,
          data.fundraiserId,
          data.donorUserId,
          data.amountCents,
          data.tipCents,
          data.totalCents,
          typeof data.tipPercent === "number" ? data.tipPercent : 0,
          data.isAnonymous,
          data.message,
          eventId,
        ]
      );

      // Update fundraiser totals
      await client.query(
        `UPDATE fundraisers
         SET raised_cents = raised_cents + $1, donor_count = donor_count + 1, updated_at = NOW()
         WHERE id = $2`,
        [data.amountCents, data.fundraiserId]
      );
    });

    // Emit platform event
    await insertEvent({
      eventId,
      type: "donation.created",
      occurredAt: now,
      payload: {
        donationId,
        fundraiserId: data.fundraiserId,
        donorUserId: data.donorUserId,
        amountCents: data.amountCents,
        tipCents: data.tipCents,
        totalCents: data.totalCents,
        isAnonymous: data.isAnonymous,
        message: data.message,
      },
    });

    return reply.status(201).send({ donationId, eventId, totalCents: data.totalCents });
  });

  /** GET /api/donations?fundraiserId=<uuid>&limit=10&cursor=<iso> */
  app.get("/api/donations", async (request: FastifyRequest, reply: FastifyReply) => {
    const query = request.query as {
      fundraiserId?: string;
      limit?: string;
      cursor?: string;
    };

    if (!query.fundraiserId) {
      return reply.status(400).send({ error: "fundraiserId is required" });
    }

    const limit = Math.min(parseInt(query.limit ?? "10", 10), 50);
    const cursor = query.cursor ? new Date(query.cursor) : new Date();

    const result = await db.query(
      `SELECT d.id, d.amount_cents, d.tip_cents, d.total_cents, d.is_anonymous, d.message, d.created_at,
              u.name as donor_name, u.avatar_url as donor_avatar
       FROM donations d
       LEFT JOIN users u ON u.id = d.donor_user_id
       WHERE d.fundraiser_id = $1 AND d.created_at < $2
       ORDER BY d.created_at DESC
       LIMIT $3`,
      [query.fundraiserId, cursor, limit]
    );

    const donations = result.rows.map((row) => ({
      ...row,
      donor_name: row.is_anonymous ? "Anonymous" : (row.donor_name ?? "Anonymous"),
      donor_avatar: row.is_anonymous ? null : row.donor_avatar,
    }));

    return reply.send({ donations, hasMore: result.rows.length === limit });
  });
}
