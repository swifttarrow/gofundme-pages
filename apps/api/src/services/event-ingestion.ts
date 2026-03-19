import { Queue } from "bullmq";
import { QueryResult, QueryResultRow } from "pg";
import { PlatformEvent } from "@gosupportme/contracts";
import { db } from "../db/client";
import { createBullMQConnection } from "../db/redis";
import { eventsIngestedTotal } from "../observability/metrics";

const bullConnection = createBullMQConnection();

const notificationQueue = new Queue("notification-queue", { connection: bullConnection });
const badgeQueue = new Queue("badge-queue", { connection: bullConnection });
const recommendationQueue = new Queue("recommendation-queue", { connection: bullConnection });

interface StoredEvent {
  id: number;
  event_id: string;
  type: string;
  payload: Record<string, unknown>;
  occurred_at: Date;
  ingested_at: Date;
}

interface Queryable {
  query: <T extends QueryResultRow = QueryResultRow>(
    text: string,
    params?: unknown[]
  ) => Promise<QueryResult<T>>;
}

export async function storeEvent(
  event: PlatformEvent,
  client: Queryable = db
): Promise<{ stored: StoredEvent; isNew: boolean }> {
  const result = await client.query<StoredEvent>(
    `INSERT INTO platform_events (event_id, type, payload, occurred_at)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (event_id) DO NOTHING
     RETURNING *`,
    [event.eventId, event.type, JSON.stringify(event.payload), event.occurredAt]
  );

  if (result.rowCount === 0) {
    // Event already exists — return existing
    const existing = await client.query<StoredEvent>(
      "SELECT * FROM platform_events WHERE event_id = $1",
      [event.eventId]
    );
    return { stored: existing.rows[0], isNew: false };
  }

  return { stored: result.rows[0], isNew: true };
}

export async function fanOutEvent(event: PlatformEvent): Promise<void> {
  // Fan-out to queues (fire-and-forget, idempotent via jobId = eventId)
  const jobOptions = {
    jobId: event.eventId,
    removeOnComplete: 100,
    removeOnFail: 200,
    attempts: 3,
    backoff: { type: "exponential" as const, delay: 1000 },
  };

  await Promise.all([
    notificationQueue.add(event.type, { event }, jobOptions),
    badgeQueue.add(event.type, { event }, jobOptions),
    recommendationQueue.add(event.type, { event }, jobOptions),
  ]);
  eventsIngestedTotal.inc({ event_type: event.type });
}

export async function insertEvent(event: PlatformEvent): Promise<{ stored: StoredEvent; isNew: boolean }> {
  const result = await storeEvent(event);
  if (result.isNew) {
    await fanOutEvent(event);
  }
  return result;
}

export async function getEvent(eventId: string): Promise<StoredEvent | null> {
  const result = await db.query<StoredEvent>(
    "SELECT * FROM platform_events WHERE event_id = $1",
    [eventId]
  );
  return result.rows[0] ?? null;
}

export async function replayEvents(eventIds: string[]): Promise<{ replayed: string[]; notFound: string[] }> {
  if (eventIds.length === 0) return { replayed: [], notFound: [] };

  const result = await db.query<StoredEvent>(
    "SELECT * FROM platform_events WHERE event_id = ANY($1)",
    [eventIds]
  );

  const found = new Set(result.rows.map((r) => r.event_id));
  const notFound = eventIds.filter((id) => !found.has(id));

  const jobOptions = {
    removeOnComplete: 100,
    removeOnFail: 200,
    attempts: 3,
    backoff: { type: "exponential" as const, delay: 1000 },
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
