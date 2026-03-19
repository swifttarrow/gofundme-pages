"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerTelemetry = registerTelemetry;
exports.structuredLog = structuredLog;
const metrics_1 = require("../observability/metrics");
function registerTelemetry(app) {
    // Instrument every request
    app.addHook("onRequest", async (request) => {
        request._startTime = Date.now();
    });
    app.addHook("onResponse", async (request, reply) => {
        const startedAt = request._startTime;
        const duration = typeof startedAt === "number" ? Date.now() - startedAt : undefined;
        const route = request.routeOptions?.url ?? request.url;
        const labels = {
            method: request.method,
            route,
            status_code: String(reply.statusCode),
        };
        metrics_1.httpRequestsTotal.inc(labels);
        if (typeof duration === "number" && Number.isFinite(duration) && duration >= 0) {
            metrics_1.httpRequestDurationMs.observe(labels, duration);
        }
    });
    // Prometheus metrics endpoint
    app.get("/metrics", async (_req, reply) => {
        const metrics = await metrics_1.register.metrics();
        void reply.header("Content-Type", metrics_1.register.contentType).send(metrics);
    });
}
function structuredLog(level, message, data) {
    const entry = {
        timestamp: new Date().toISOString(),
        level,
        message,
        ...data,
    };
    if (level === "error") {
        console.error(JSON.stringify(entry));
    }
    else if (level === "warn") {
        console.warn(JSON.stringify(entry));
    }
    else {
        console.log(JSON.stringify(entry));
    }
}
