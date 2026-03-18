import client from "prom-client";

const register = new client.Registry();
client.collectDefaultMetrics({ register });

export const httpRequestsTotal = new client.Counter({
  name: "http_requests_total",
  help: "Total HTTP requests",
  labelNames: ["method", "route", "status_code"],
  registers: [register],
});

export const httpRequestDurationMs = new client.Histogram({
  name: "http_request_duration_ms",
  help: "HTTP request duration in milliseconds",
  labelNames: ["method", "route", "status_code"],
  buckets: [5, 10, 25, 50, 100, 250, 500, 1000, 2500],
  registers: [register],
});

export const eventsIngestedTotal = new client.Counter({
  name: "events_ingested_total",
  help: "Total platform events ingested",
  labelNames: ["event_type"],
  registers: [register],
});

export const jobsProcessedTotal = new client.Counter({
  name: "jobs_processed_total",
  help: "Total BullMQ jobs processed",
  labelNames: ["queue", "status"],
  registers: [register],
});

export const notificationsCreatedTotal = new client.Counter({
  name: "notifications_created_total",
  help: "Total notifications created",
  labelNames: ["type"],
  registers: [register],
});

export const donationsTotal = new client.Counter({
  name: "donations_total",
  help: "Total successful donations",
  labelNames: ["status"],
  registers: [register],
});

export const workerJobDurationMs = new client.Histogram({
  name: "worker_job_duration_ms",
  help: "BullMQ worker job duration in milliseconds",
  labelNames: ["queue", "processor"],
  buckets: [10, 50, 100, 500, 1000, 5000, 10000],
  registers: [register],
});

export const workerQueueDepth = new client.Gauge({
  name: "worker_queue_depth",
  help: "Current BullMQ queue depth",
  labelNames: ["queue_name"],
  registers: [register],
});

export const aiCallsTotal = new client.Counter({
  name: "ai_calls_total",
  help: "Total AI API calls",
  labelNames: ["feature", "model", "status"],
  registers: [register],
});

export const aiTokensUsedTotal = new client.Counter({
  name: "ai_tokens_used_total",
  help: "Total AI tokens used",
  labelNames: ["feature", "type"],
  registers: [register],
});

export const recommendationCacheHitsTotal = new client.Counter({
  name: "recommendation_cache_hits_total",
  help: "Recommendation cache hit/miss counts",
  labelNames: ["result"],
  registers: [register],
});

export const notificationDedupeTotal = new client.Counter({
  name: "notification_dedupe_total",
  help: "Notifications suppressed by deduplication",
  registers: [register],
});

export { register };
