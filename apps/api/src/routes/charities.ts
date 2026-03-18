import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { db } from "../db/client";
import {
  canTransition,
  nextStatus,
  normalizeEligibilityState,
} from "../services/charity-request-state";

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

const SESSION_COOKIE_NAME = "gosupportme_session";

const EligibilityQuerySchema = z.object({
  userId: z.string().uuid(),
});

const CreateCharityRequestSchema = z.object({
  userId: z.string().uuid(),
  charityName: z.string().trim().min(2).max(200),
  mission: z.string().trim().min(10).max(5000),
  beneficiaries: z.string().trim().min(4).max(400),
  fundUsage: z.string().trim().min(10).max(3000),
  location: z.string().trim().min(2).max(200),
  coverImageUrl: z.string().url().optional(),
  idempotencyKey: z.string().min(8).max(120),
});

const ResubmitSchema = z.object({
  userId: z.string().uuid(),
  charityName: z.string().trim().min(2).max(200),
  mission: z.string().trim().min(10).max(5000),
  beneficiaries: z.string().trim().min(4).max(400),
  fundUsage: z.string().trim().min(10).max(3000),
  location: z.string().trim().min(2).max(200),
  coverImageUrl: z.string().url().optional(),
});

const DecisionSchema = z.object({
  actorUserId: z.string().uuid(),
  decision: z.enum(["approve", "reject"]),
  reason: z.string().trim().min(3).max(500),
});

type SessionClaims = { sub: string; email: string };

function parseCookieValue(cookieHeader: string | undefined, cookieName: string): string | null {
  if (!cookieHeader) return null;

  const parts = cookieHeader.split(";");
  for (const part of parts) {
    const [rawName, ...rest] = part.trim().split("=");
    if (rawName !== cookieName) continue;
    return rest.join("=") || null;
  }
  return null;
}

async function ensureActorMatchesSession(
  app: FastifyInstance,
  request: FastifyRequest,
  actorId: string
): Promise<boolean> {
  const token = parseCookieValue(request.headers.cookie, SESSION_COOKIE_NAME);
  if (!token) return false;
  try {
    const claims = await app.jwt.verify<SessionClaims>(token);
    return claims.sub === actorId;
  } catch {
    return false;
  }
}

export async function charitiesRoutes(app: FastifyInstance): Promise<void> {
  /** GET /api/charities/requests/eligibility?userId=... */
  app.get(
    "/api/charities/requests/eligibility",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const parse = EligibilityQuerySchema.safeParse(request.query);
      if (!parse.success) {
        return reply.status(400).send({ error: "Validation failed", details: parse.error.flatten() });
      }

      const userId = parse.data.userId;
      const [reviewRow, activeCharity] = await Promise.all([
        db.query(
          `SELECT id
           FROM charity_requests
           WHERE user_id = $1 AND status = 'under_review'
           LIMIT 1`,
          [userId]
        ),
        db.query(
          `SELECT id
           FROM charities
           WHERE organizer_id = $1 AND status = 'active'
           LIMIT 1`,
          [userId]
        ),
      ]);

      const state = normalizeEligibilityState({
        hasUnderReviewRequest: (reviewRow.rowCount ?? 0) > 0,
        hasActiveCharity: (activeCharity.rowCount ?? 0) > 0,
      });

      return reply.send({ state });
    }
  );

  /** POST /api/charities/requests */
  app.post("/api/charities/requests", async (request: FastifyRequest, reply: FastifyReply) => {
    const parse = CreateCharityRequestSchema.safeParse(request.body);
    if (!parse.success) {
      return reply.status(400).send({ error: "Validation failed", details: parse.error.flatten() });
    }

    const data = parse.data;
    const [existingUnderReview, existingActive, existingByKey] = await Promise.all([
      db.query(
        `SELECT id FROM charity_requests
         WHERE user_id = $1 AND status = 'under_review'
         LIMIT 1`,
        [data.userId]
      ),
      db.query(
        `SELECT id FROM charities
         WHERE organizer_id = $1 AND status = 'active'
         LIMIT 1`,
        [data.userId]
      ),
      db.query(
        `SELECT *
         FROM charity_requests
         WHERE user_id = $1 AND idempotency_key = $2
         LIMIT 1`,
        [data.userId, data.idempotencyKey]
      ),
    ]);

    if ((existingByKey.rowCount ?? 0) > 0) {
      return reply.status(200).send(existingByKey.rows[0]);
    }

    if ((existingUnderReview.rowCount ?? 0) > 0 || (existingActive.rowCount ?? 0) > 0) {
      return reply.status(409).send({
        error:
          "You can only create one charity at a time. Your current request is still in progress.",
      });
    }

    const inserted = await db.query(
      `INSERT INTO charity_requests (
         user_id, charity_name, mission, beneficiaries, fund_usage,
         location, cover_image_url, status, idempotency_key
       )
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'under_review', $8)
       RETURNING *`,
      [
        data.userId,
        data.charityName,
        data.mission,
        data.beneficiaries,
        data.fundUsage,
        data.location,
        data.coverImageUrl ?? null,
        data.idempotencyKey,
      ]
    );

    return reply.status(201).send(inserted.rows[0]);
  });

  /** GET /api/charities/requests/mine?userId=... */
  app.get("/api/charities/requests/mine", async (request: FastifyRequest, reply: FastifyReply) => {
    const parse = EligibilityQuerySchema.safeParse(request.query);
    if (!parse.success) {
      return reply.status(400).send({ error: "Validation failed", details: parse.error.flatten() });
    }

    const result = await db.query(
      `SELECT *
       FROM charity_requests
       WHERE user_id = $1
       ORDER BY updated_at DESC
       LIMIT 1`,
      [parse.data.userId]
    );

    if (result.rowCount === 0) {
      return reply.status(404).send({ error: "No charity request found" });
    }

    return reply.send(result.rows[0]);
  });

  /** POST /api/charities/requests/:id/resubmit */
  app.post(
    "/api/charities/requests/:id/resubmit",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { id } = request.params as { id: string };
      const parse = ResubmitSchema.safeParse(request.body);
      if (!parse.success) {
        return reply.status(400).send({ error: "Validation failed", details: parse.error.flatten() });
      }

      const data = parse.data;
      const existing = await db.query(
        `SELECT id, user_id, status
         FROM charity_requests
         WHERE id = $1
         LIMIT 1`,
        [id]
      );
      if (existing.rowCount === 0) {
        return reply.status(404).send({ error: "Request not found" });
      }

      const requestRow = existing.rows[0] as { user_id: string; status: "under_review" | "approved" | "rejected" };
      if (requestRow.user_id !== data.userId) {
        return reply.status(403).send({ error: "Not authorized" });
      }
      if (!canTransition(requestRow.status, "resubmit")) {
        return reply.status(409).send({ error: "Only rejected requests can be resubmitted" });
      }

      const updated = await db.query(
        `UPDATE charity_requests
         SET charity_name = $1,
             mission = $2,
             beneficiaries = $3,
             fund_usage = $4,
             location = $5,
             cover_image_url = $6,
             status = $7,
             decision_reason = NULL,
             reviewed_by = NULL,
             reviewed_at = NULL
         WHERE id = $8
         RETURNING *`,
        [
          data.charityName,
          data.mission,
          data.beneficiaries,
          data.fundUsage,
          data.location,
          data.coverImageUrl ?? null,
          nextStatus("rejected", "resubmit"),
          id,
        ]
      );

      return reply.send(updated.rows[0]);
    }
  );

  /** POST /api/charities/requests/:id/decision */
  app.post(
    "/api/charities/requests/:id/decision",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { id } = request.params as { id: string };
      const parse = DecisionSchema.safeParse(request.body);
      if (!parse.success) {
        return reply.status(400).send({ error: "Validation failed", details: parse.error.flatten() });
      }

      const { actorUserId, decision, reason } = parse.data;
      const matchesSession = await ensureActorMatchesSession(app, request, actorUserId);
      if (!matchesSession) {
        return reply.status(401).send({ error: "Not authenticated as decision actor" });
      }

      const actor = await db.query("SELECT id, role FROM users WHERE id = $1 LIMIT 1", [actorUserId]);
      if (actor.rowCount === 0) {
        return reply.status(404).send({ error: "Staff user not found" });
      }
      const actorRole = String((actor.rows[0] as Record<string, unknown>).role ?? "");
      if (actorRole !== "admin") {
        return reply.status(403).send({ error: "Staff admin role required" });
      }

      const result = await db.transaction(async (client) => {
        const requestResult = await client.query(
          `SELECT *
           FROM charity_requests
           WHERE id = $1
           LIMIT 1`,
          [id]
        );
        if (requestResult.rowCount === 0) {
          return { type: "not_found" as const };
        }

        const requestRow = requestResult.rows[0] as {
          id: string;
          user_id: string;
          status: "under_review" | "approved" | "rejected";
          charity_name: string;
          mission: string;
          fund_usage: string;
        };

        if (!canTransition(requestRow.status, decision)) {
          return { type: "invalid_transition" as const };
        }

        const status = nextStatus(requestRow.status, decision);
        const updatedResult = await client.query(
          `UPDATE charity_requests
           SET status = $1,
               decision_reason = $2,
               reviewed_by = $3,
               reviewed_at = NOW()
           WHERE id = $4
           RETURNING *`,
          [status, reason, actorUserId, id]
        );
        const updated = updatedResult.rows[0];

        if (decision === "approve") {
          const charityResult = await client.query(
            `INSERT INTO charities (organizer_id, name, description, fund_allocation, status)
             VALUES ($1, $2, $3, $4, 'active')
             RETURNING id`,
            [requestRow.user_id, requestRow.charity_name, requestRow.mission, requestRow.fund_usage]
          );

          return {
            type: "ok" as const,
            request: updated,
            charityId: (charityResult.rows[0] as { id: string }).id,
          };
        }

        return {
          type: "ok" as const,
          request: updated,
          charityId: null,
        };
      });

      if (result.type === "not_found") {
        return reply.status(404).send({ error: "Request not found" });
      }
      if (result.type === "invalid_transition") {
        return reply.status(409).send({ error: "Invalid state transition" });
      }

      return reply.send({
        request: result.request,
        charityId: result.charityId,
      });
    }
  );

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
