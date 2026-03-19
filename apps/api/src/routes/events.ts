import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { PlatformEventSchema } from "@gosupportme/contracts";
import { insertEvent, replayEvents, getEvent } from "../services/event-ingestion";

export async function eventsRoutes(app: FastifyInstance): Promise<void> {
  /** POST /api/events — ingest a platform event */
  app.post("/api/events", async (request: FastifyRequest, reply: FastifyReply) => {
    const parse = PlatformEventSchema.safeParse(request.body);
    if (!parse.success) {
      return reply.status(400).send({ error: "Validation failed", details: parse.error.flatten() });
    }

    const { stored, isNew } = await insertEvent(parse.data, { requestId: request.id });

    return reply.status(isNew ? 201 : 200).send({
      eventId: stored.event_id,
      isNew,
      ingestedAt: stored.ingested_at,
    });
  });

  /** POST /api/replay — re-enqueue events by ID */
  app.post("/api/replay", async (request: FastifyRequest, reply: FastifyReply) => {
    const bodySchema = z.object({
      eventIds: z.array(z.string().uuid()).min(1).max(100),
    });
    const parse = bodySchema.safeParse(request.body);
    if (!parse.success) {
      return reply.status(400).send({ error: "Validation failed", details: parse.error.flatten() });
    }

    const result = await replayEvents(parse.data.eventIds);
    return reply.send(result);
  });

  /** GET /api/events/:eventId */
  app.get("/api/events/:eventId", async (request: FastifyRequest, reply: FastifyReply) => {
    const { eventId } = request.params as { eventId: string };
    const event = await getEvent(eventId);
    if (!event) return reply.status(404).send({ error: "Event not found" });
    return reply.send(event);
  });
}
