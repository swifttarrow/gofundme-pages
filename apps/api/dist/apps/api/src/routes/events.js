"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventsRoutes = eventsRoutes;
const zod_1 = require("zod");
const contracts_1 = require("@gosupportme/contracts");
const event_ingestion_1 = require("../services/event-ingestion");
async function eventsRoutes(app) {
    /** POST /api/events — ingest a platform event */
    app.post("/api/events", async (request, reply) => {
        const parse = contracts_1.PlatformEventSchema.safeParse(request.body);
        if (!parse.success) {
            return reply.status(400).send({ error: "Validation failed", details: parse.error.flatten() });
        }
        const { stored, isNew } = await (0, event_ingestion_1.insertEvent)(parse.data);
        return reply.status(isNew ? 201 : 200).send({
            eventId: stored.event_id,
            isNew,
            ingestedAt: stored.ingested_at,
        });
    });
    /** POST /api/replay — re-enqueue events by ID */
    app.post("/api/replay", async (request, reply) => {
        const bodySchema = zod_1.z.object({
            eventIds: zod_1.z.array(zod_1.z.string().uuid()).min(1).max(100),
        });
        const parse = bodySchema.safeParse(request.body);
        if (!parse.success) {
            return reply.status(400).send({ error: "Validation failed", details: parse.error.flatten() });
        }
        const result = await (0, event_ingestion_1.replayEvents)(parse.data.eventIds);
        return reply.send(result);
    });
    /** GET /api/events/:eventId */
    app.get("/api/events/:eventId", async (request, reply) => {
        const { eventId } = request.params;
        const event = await (0, event_ingestion_1.getEvent)(eventId);
        if (!event)
            return reply.status(404).send({ error: "Event not found" });
        return reply.send(event);
    });
}
