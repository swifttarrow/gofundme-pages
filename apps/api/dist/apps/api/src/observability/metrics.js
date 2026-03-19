"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = exports.notificationDedupeTotal = exports.recommendationCacheHitsTotal = exports.aiTokensUsedTotal = exports.aiCallsTotal = exports.workerQueueDepth = exports.workerJobDurationMs = exports.donationsTotal = exports.notificationsCreatedTotal = exports.jobsProcessedTotal = exports.eventsIngestedTotal = exports.httpRequestDurationMs = exports.httpRequestsTotal = void 0;
const prom_client_1 = __importDefault(require("prom-client"));
const register = new prom_client_1.default.Registry();
exports.register = register;
prom_client_1.default.collectDefaultMetrics({ register });
exports.httpRequestsTotal = new prom_client_1.default.Counter({
    name: "http_requests_total",
    help: "Total HTTP requests",
    labelNames: ["method", "route", "status_code"],
    registers: [register],
});
exports.httpRequestDurationMs = new prom_client_1.default.Histogram({
    name: "http_request_duration_ms",
    help: "HTTP request duration in milliseconds",
    labelNames: ["method", "route", "status_code"],
    buckets: [5, 10, 25, 50, 100, 250, 500, 1000, 2500],
    registers: [register],
});
exports.eventsIngestedTotal = new prom_client_1.default.Counter({
    name: "events_ingested_total",
    help: "Total platform events ingested",
    labelNames: ["event_type"],
    registers: [register],
});
exports.jobsProcessedTotal = new prom_client_1.default.Counter({
    name: "jobs_processed_total",
    help: "Total BullMQ jobs processed",
    labelNames: ["queue", "status"],
    registers: [register],
});
exports.notificationsCreatedTotal = new prom_client_1.default.Counter({
    name: "notifications_created_total",
    help: "Total notifications created",
    labelNames: ["type"],
    registers: [register],
});
exports.donationsTotal = new prom_client_1.default.Counter({
    name: "donations_total",
    help: "Total successful donations",
    labelNames: ["status"],
    registers: [register],
});
exports.workerJobDurationMs = new prom_client_1.default.Histogram({
    name: "worker_job_duration_ms",
    help: "BullMQ worker job duration in milliseconds",
    labelNames: ["queue", "processor"],
    buckets: [10, 50, 100, 500, 1000, 5000, 10000],
    registers: [register],
});
exports.workerQueueDepth = new prom_client_1.default.Gauge({
    name: "worker_queue_depth",
    help: "Current BullMQ queue depth",
    labelNames: ["queue_name"],
    registers: [register],
});
exports.aiCallsTotal = new prom_client_1.default.Counter({
    name: "ai_calls_total",
    help: "Total AI API calls",
    labelNames: ["feature", "model", "status"],
    registers: [register],
});
exports.aiTokensUsedTotal = new prom_client_1.default.Counter({
    name: "ai_tokens_used_total",
    help: "Total AI tokens used",
    labelNames: ["feature", "type"],
    registers: [register],
});
exports.recommendationCacheHitsTotal = new prom_client_1.default.Counter({
    name: "recommendation_cache_hits_total",
    help: "Recommendation cache hit/miss counts",
    labelNames: ["result"],
    registers: [register],
});
exports.notificationDedupeTotal = new prom_client_1.default.Counter({
    name: "notification_dedupe_total",
    help: "Notifications suppressed by deduplication",
    registers: [register],
});
