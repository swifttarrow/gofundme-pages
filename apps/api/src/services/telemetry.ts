import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import {
  register,
  httpRequestsTotal,
  httpRequestDurationSeconds,
  httpRequestsInFlight,
  httpRequestErrorsTotal,
  statusClass,
} from "../observability/metrics";

const SERVICE_NAME = process.env.SERVICE_NAME ?? "gosupportme-api";
const ENVIRONMENT = process.env.NODE_ENV ?? "development";

type InstrumentedRequest = FastifyRequest & { _startTime?: number };

function routeLabel(request: FastifyRequest): string {
  return (request.routeOptions?.url as string | undefined) ?? request.url;
}

function baseLogFields(request?: FastifyRequest): Record<string, unknown> {
  return {
    service: SERVICE_NAME,
    environment: ENVIRONMENT,
    ...(request?.id ? { request_id: request.id } : {}),
  };
}

export function structuredLog(
  level: "info" | "warn" | "error",
  message: string,
  data?: Record<string, unknown>
): void {
  const entry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    service: SERVICE_NAME,
    environment: ENVIRONMENT,
    ...data,
  };
  const line = JSON.stringify(entry);
  if (level === "error") {
    console.error(line);
  } else if (level === "warn") {
    console.warn(line);
  } else {
    console.log(line);
  }
}

export function logError(message: string, err: unknown, extra?: Record<string, unknown>): void {
  const { name, msg } = toErrorParts(err);
  structuredLog("error", message, {
    ...extra,
    error_name: name,
    error_message: msg,
  });
}

function toErrorParts(err: unknown): { name: string; msg: string } {
  if (err instanceof Error) {
    return { name: err.name, msg: err.message };
  }
  return { name: "Error", msg: String(err) };
}

export function registerTelemetry(app: FastifyInstance): void {
  app.addHook("onRequest", async (request: FastifyRequest) => {
    (request as InstrumentedRequest)._startTime = Date.now();
    httpRequestsInFlight.inc();
    const route = routeLabel(request);
    structuredLog("info", "request.start", {
      ...baseLogFields(request),
      method: request.method,
      route,
    });
  });

  app.addHook("onResponse", async (request: FastifyRequest, reply: FastifyReply) => {
    httpRequestsInFlight.dec();
    const startedAt = (request as InstrumentedRequest)._startTime;
    const durationMs = typeof startedAt === "number" ? Date.now() - startedAt : undefined;
    const route = routeLabel(request);
    const code = reply.statusCode;
    const sClass = statusClass(code);
    const labels = {
      method: request.method,
      route,
      status_code: String(code),
      status_class: sClass,
    };
    httpRequestsTotal.inc(labels);
    if (typeof durationMs === "number" && Number.isFinite(durationMs) && durationMs >= 0) {
      httpRequestDurationSeconds.observe(labels, durationMs / 1000);
    }
    if (code >= 400) {
      httpRequestErrorsTotal.inc(labels);
    }

    const eventId =
      (request as FastifyRequest & { observabilityEventId?: string }).observabilityEventId;

    const completionPayload: Record<string, unknown> = {
      ...baseLogFields(request),
      method: request.method,
      route,
      status_code: code,
      status_class: sClass,
      duration_ms: typeof durationMs === "number" ? durationMs : null,
    };
    if (eventId) {
      completionPayload.event_id = eventId;
    }

    const level = code >= 500 ? "error" : code >= 400 ? "warn" : "info";
    structuredLog(level, "request.completed", completionPayload);
  });

  app.setErrorHandler((error, request, reply) => {
    logError("request.unhandled_error", error, {
      ...baseLogFields(request),
      method: request.method,
      route: routeLabel(request),
    });
    const status =
      typeof (error as { statusCode?: number }).statusCode === "number"
        ? (error as { statusCode: number }).statusCode
        : 500;
    const exposeMessage = process.env.NODE_ENV !== "production" || status < 500;
    void reply.status(status).send({
      error: status >= 500 ? "Internal Server Error" : error.message,
      ...(exposeMessage ? { message: error.message } : {}),
    });
  });

  app.get("/metrics", async (_req: FastifyRequest, reply: FastifyReply) => {
    const metrics = await register.metrics();
    void reply.header("Content-Type", register.contentType).send(metrics);
  });
}
