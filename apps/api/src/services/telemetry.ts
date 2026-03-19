import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import {
  register,
  httpRequestsTotal,
  httpRequestDurationMs,
} from "../observability/metrics";

type InstrumentedRequest = FastifyRequest & { _startTime?: number };

export function registerTelemetry(app: FastifyInstance): void {
  // Instrument every request
  app.addHook("onRequest", async (request: FastifyRequest) => {
    (request as InstrumentedRequest)._startTime = Date.now();
  });

  app.addHook("onResponse", async (request: FastifyRequest, reply: FastifyReply) => {
    const startedAt = (request as InstrumentedRequest)._startTime;
    const duration = typeof startedAt === "number" ? Date.now() - startedAt : undefined;
    const route = (request.routeOptions?.url as string | undefined) ?? request.url;
    const labels = {
      method: request.method,
      route,
      status_code: String(reply.statusCode),
    };
    httpRequestsTotal.inc(labels);
    if (typeof duration === "number" && Number.isFinite(duration) && duration >= 0) {
      httpRequestDurationMs.observe(labels, duration);
    }
  });

  // Prometheus metrics endpoint
  app.get("/metrics", async (_req: FastifyRequest, reply: FastifyReply) => {
    const metrics = await register.metrics();
    void reply.header("Content-Type", register.contentType).send(metrics);
  });
}

export function structuredLog(level: "info" | "warn" | "error", message: string, data?: Record<string, unknown>): void {
  const entry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...data,
  };
  if (level === "error") {
    console.error(JSON.stringify(entry));
  } else if (level === "warn") {
    console.warn(JSON.stringify(entry));
  } else {
    console.log(JSON.stringify(entry));
  }
}
