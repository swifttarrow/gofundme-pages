import client from "prom-client";

const register = new client.Registry();
client.collectDefaultMetrics({ register });

function statusClass(statusCode: number): string {
  if (statusCode >= 500) return "5xx";
  if (statusCode >= 400) return "4xx";
  if (statusCode >= 300) return "3xx";
  if (statusCode >= 200) return "2xx";
  if (statusCode >= 100) return "1xx";
  return "unknown";
}

export { statusClass };

/** Standard HTTP request volume; use with rate() for RPS. */
export const httpRequestsTotal = new client.Counter({
  name: "http_requests_total",
  help: "Total HTTP requests",
  labelNames: ["method", "route", "status_code", "status_class"],
  registers: [register],
});

/** Latency histogram in seconds (Prometheus convention). */
export const httpRequestDurationSeconds = new client.Histogram({
  name: "http_request_duration_seconds",
  help: "HTTP request duration in seconds",
  labelNames: ["method", "route", "status_code", "status_class"],
  buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10],
  registers: [register],
});

export const httpRequestsInFlight = new client.Gauge({
  name: "http_requests_in_flight",
  help: "HTTP requests currently being processed",
  registers: [register],
});

/** Count of responses with status >= 400. */
export const httpRequestErrorsTotal = new client.Counter({
  name: "http_request_errors_total",
  help: "HTTP responses with client or server error status",
  labelNames: ["method", "route", "status_code", "status_class"],
  registers: [register],
});

export const pageViewsTotal = new client.Counter({
  name: "page_views_total",
  help: "Page views reported from the web app",
  labelNames: ["page_type"],
  registers: [register],
});

export const donationAttemptsTotal = new client.Counter({
  name: "donation_attempts_total",
  help: "Donation POST requests received",
  registers: [register],
});

export const donationSuccessTotal = new client.Counter({
  name: "donation_success_total",
  help: "Donations completed successfully",
  registers: [register],
});

export const donationFailTotal = new client.Counter({
  name: "donation_fail_total",
  help: "Donation requests that did not result in a created donation",
  registers: [register],
});

export const platformEventsPersistedTotal = new client.Counter({
  name: "platform_events_persisted_total",
  help: "New platform events stored in the database",
  labelNames: ["event_type"],
  registers: [register],
});

export const notificationsCreatedTotal = new client.Counter({
  name: "notifications_created_total",
  help: "Notifications created",
  labelNames: ["type"],
  registers: [register],
});

export const badgeEvaluationsTotal = new client.Counter({
  name: "badge_evaluations_total",
  help: "Badge evaluation runs completed",
  registers: [register],
});

export const workerJobsStartedTotal = new client.Counter({
  name: "worker_jobs_started_total",
  help: "Worker jobs picked up for processing",
  labelNames: ["processor"],
  registers: [register],
});

export const workerJobsCompletedTotal = new client.Counter({
  name: "worker_jobs_completed_total",
  help: "Worker jobs finished successfully",
  labelNames: ["processor"],
  registers: [register],
});

export const workerJobsFailedTotal = new client.Counter({
  name: "worker_jobs_failed_total",
  help: "Worker jobs failed after errors",
  labelNames: ["processor"],
  registers: [register],
});

export const workerJobDurationSeconds = new client.Histogram({
  name: "worker_job_duration_seconds",
  help: "Worker job processing duration in seconds",
  labelNames: ["processor"],
  buckets: [0.01, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 15, 60],
  registers: [register],
});

/** Backlog by queue and coarse job state (waiting, delayed, active, failed). */
export const workerQueueBacklog = new client.Gauge({
  name: "worker_queue_backlog",
  help: "BullMQ queue counts by state",
  labelNames: ["queue", "state"],
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
  labelNames: ["result"],
  registers: [register],
});

export { register };
