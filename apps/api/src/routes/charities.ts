import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { db } from "../db/client";

const CreateCharitySchema = z.object({
  organizerId: z.string().uuid(),
  name: z.string().min(2).max(200),
  description: z.string().min(10).max(5000),
  ein: z.string().optional(),
  websiteUrl: z.string().url().optional(),
  fundAllocation: z.string().max(1000).optional(),
  milestones: z
    .array(
      z.object({
        amount: z.number().int().positive(),
        label: z.string().max(200),
      })
    )
    .default([]),
});

export async function charitiesRoutes(app: FastifyInstance): Promise<void> {
  /** POST /api/charities */
  app.post("/api/charities", async (request: FastifyRequest, reply: FastifyReply) => {
    const parse = CreateCharitySchema.safeParse(request.body);
    if (!parse.success) {
      return reply.status(400).send({ error: "Validation failed", details: parse.error.flatten() });
    }

    const data = parse.data;

    // Verify organizer exists and has organizer/admin role
    const user = await db.query(
      "SELECT id, role FROM users WHERE id = $1",
      [data.organizerId]
    );
    if (user.rowCount === 0) {
      return reply.status(404).send({ error: "User not found" });
    }
    const userRow = user.rows[0] as Record<string, unknown>;
    if (!["organizer", "admin"].includes(String(userRow.role ?? ""))) {
      return reply.status(403).send({ error: "Only organizers can create charities" });
    }

    const result = await db.query(
      `INSERT INTO charities (organizer_id, name, description, ein, website_url, fund_allocation, milestones)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        data.organizerId,
        data.name,
        data.description,
        data.ein ?? null,
        data.websiteUrl ?? null,
        data.fundAllocation ?? null,
        JSON.stringify(data.milestones),
      ]
    );

    return reply.status(201).send(result.rows[0]);
  });

  /** GET /api/charities/:id */
  app.get("/api/charities/:id", async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string };

    const [charityResult, fundraisersResult] = await Promise.all([
      db.query(
        `SELECT c.*, u.name as organizer_name, u.avatar_url as organizer_avatar
         FROM charities c
         JOIN users u ON u.id = c.organizer_id
         WHERE c.id = $1`,
        [id]
      ),
      db.query(
        `SELECT f.id, f.title, f.cover_image_url, f.raised_cents, f.goal_cents, f.donor_count
         FROM charity_fundraisers cf
         JOIN fundraisers f ON f.id = cf.fundraiser_id
         WHERE cf.charity_id = $1
         LIMIT 20`,
        [id]
      ),
    ]);

    if (charityResult.rowCount === 0) {
      return reply.status(404).send({ error: "Charity not found" });
    }

    return reply.send({
      ...charityResult.rows[0],
      fundraisers: fundraisersResult.rows,
    });
  });

  /** PATCH /api/charities/:id/fundraisers/:fid */
  app.patch(
    "/api/charities/:id/fundraisers/:fid",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { id, fid } = request.params as { id: string; fid: string };
      const { organizerId } = request.body as { organizerId?: string };

      if (!organizerId) {
        return reply.status(400).send({ error: "organizerId is required" });
      }

      // Verify charity belongs to this organizer
      const charity = await db.query(
        "SELECT id, organizer_id FROM charities WHERE id = $1",
        [id]
      );
      if (charity.rowCount === 0) {
        return reply.status(404).send({ error: "Charity not found" });
      }
      if (charity.rows[0].organizer_id !== organizerId) {
        return reply.status(403).send({ error: "Not authorized" });
      }

      await db.query(
        `INSERT INTO charity_fundraisers (charity_id, fundraiser_id)
         VALUES ($1, $2)
         ON CONFLICT DO NOTHING`,
        [id, fid]
      );

      return reply.send({ charityId: id, fundraiserId: fid, linked: true });
    }
  );
}
