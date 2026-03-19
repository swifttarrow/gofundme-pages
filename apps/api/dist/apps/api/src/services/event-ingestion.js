"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storeEvent = storeEvent;
exports.fanOutEvent = fanOutEvent;
exports.insertEvent = insertEvent;
exports.getEvent = getEvent;
exports.replayEvents = replayEvents;
const bullmq_1 = require("bullmq");
const client_1 = require("../db/client");
const redis_1 = require("../db/redis");
const metrics_1 = require("../observability/metrics");
const bullConnection = (0, redis_1.createBullMQConnection)();
const notificationQueue = new bullmq_1.Queue("notification-queue", { connection: bullConnection });
const badgeQueue = new bullmq_1.Queue("badge-queue", { connection: bullConnection });
const recommendationQueue = new bullmq_1.Queue("recommendation-queue", { connection: bullConnection });
async function storeEvent(event, client = client_1.db) {
    const result = await client.query(`INSERT INTO platform_events (event_id, type, payload, occurred_at)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (event_id) DO NOTHING
     RETURNING *`, [event.eventId, event.type, JSON.stringify(event.payload), event.occurredAt]);
    if (result.rowCount === 0) {
        // Event already exists — return existing
        const existing = await client.query("SELECT * FROM platform_events WHERE event_id = $1", [event.eventId]);
        return { stored: existing.rows[0], isNew: false };
    }
    return { stored: result.rows[0], isNew: true };
}
async function fanOutEvent(event) {
    // Fan-out to queues (fire-and-forget, idempotent via jobId = eventId)
    const jobOptions = {
        jobId: event.eventId,
        removeOnComplete: 100,
        removeOnFail: 200,
        attempts: 3,
        backoff: { type: "exponential", delay: 1000 },
    };
    await Promise.all([
        notificationQueue.add(event.type, { event }, jobOptions),
        badgeQueue.add(event.type, { event }, jobOptions),
        recommendationQueue.add(event.type, { event }, jobOptions),
    ]);
    metrics_1.eventsIngestedTotal.inc({ event_type: event.type });
}
async function insertEvent(event) {
    const result = await storeEvent(event);
    if (result.isNew) {
        await fanOutEvent(event);
    }
    return result;
}
async function getEvent(eventId) {
    const result = await client_1.db.query("SELECT * FROM platform_events WHERE event_id = $1", [eventId]);
    return result.rows[0] ?? null;
}
async function replayEvents(eventIds) {
    if (eventIds.length === 0)
        return { replayed: [], notFound: [] };
    const result = await client_1.db.query("SELECT * FROM platform_events WHERE event_id = ANY($1)", [eventIds]);
    const found = new Set(result.rows.map((r) => r.event_id));
    const notFound = eventIds.filter((id) => !found.has(id));
    const jobOptions = {
        removeOnComplete: 100,
        removeOnFail: 200,
        attempts: 3,
        backoff: { type: "exponential", delay: 1000 },
    };
    for (const row of result.rows) {
        const replayJobId = `replay-${row.event_id}-${Date.now()}`;
        const payload = { event: { eventId: row.event_id, type: row.type, payload: row.payload, occurredAt: row.occurred_at.toISOString() } };
        await Promise.all([
            notificationQueue.add(row.type, payload, { ...jobOptions, jobId: replayJobId + "-n" }),
            badgeQueue.add(row.type, payload, { ...jobOptions, jobId: replayJobId + "-b" }),
            recommendationQueue.add(row.type, payload, { ...jobOptions, jobId: replayJobId + "-r" }),
        ]);
    }
    return { replayed: result.rows.map((r) => r.event_id), notFound };
}
