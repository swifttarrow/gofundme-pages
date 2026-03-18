import Fastify from "fastify";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import rateLimit from "@fastify/rate-limit";
import fp from "fastify-plugin";

import { eventsRoutes } from "./routes/events";
import { donationsRoutes } from "./routes/donations";
import { fundraisersRoutes } from "./routes/fundraisers";
import { notificationsRoutes } from "./routes/notifications";
import { recommendationsRoutes } from "./routes/recommendations";
import { badgesRoutes } from "./routes/badges";
import { charitiesRoutes } from "./routes/charities";
import { feedRoutes } from "./routes/feed";
import { followsRoutes } from "./routes/follows";
import { authRoutes } from "./routes/auth";
import { registerTelemetry } from "./services/telemetry";
import { startWorkers } from "./worker/index";
import { db } from "./db/client";

const PORT = parseInt(process.env.PORT ?? "3001", 10);
const HOST = process.env.HOST ?? "0.0.0.0";

async function buildApp() {
  const app = Fastify({
    logger: {
      level: process.env.LOG_LEVEL ?? "info",
      transport:
        process.env.NODE_ENV !== "production"
          ? { target: "pino-pretty" }
          : undefined,
    },
    genReqId: () => {
      const { randomUUID } = require("crypto");
      return randomUUID() as string;
    },
  });

  // ─── Plugins ────────────────────────────────────────────────────────────────
  await app.register(cors, {
    origin: process.env.CORS_ORIGIN?.split(",") ?? ["http://localhost:3000"],
    credentials: true,
  });

  await app.register(rateLimit, {
    max: 200,
    timeWindow: "1 minute",
  });

  await app.register(jwt, {
    secret: process.env.JWT_SECRET ?? "gosupportme-dev-secret-change-in-production",
  });

  // ─── Telemetry ───────────────────────────────────────────────────────────────
  registerTelemetry(app);

  // ─── Health ──────────────────────────────────────────────────────────────────
  app.get("/health", async (_req, reply) => {
    try {
      await db.query("SELECT 1");
      return reply.send({ status: "ok", db: "connected", ts: new Date().toISOString() });
    } catch {
      return reply.status(503).send({ status: "degraded", db: "disconnected" });
    }
  });

  // ─── Routes ──────────────────────────────────────────────────────────────────
  await app.register(fp(eventsRoutes));
  await app.register(fp(donationsRoutes));
  await app.register(fp(fundraisersRoutes));
  await app.register(fp(notificationsRoutes));
  await app.register(fp(recommendationsRoutes));
  await app.register(fp(badgesRoutes));
  await app.register(fp(charitiesRoutes));
  await app.register(fp(feedRoutes));
  await app.register(fp(followsRoutes));
  await app.register(fp(authRoutes));

  return app;
}

async function main() {
  const app = await buildApp();

  // Start background workers
  const { shutdown: shutdownWorkers } = startWorkers();

  try {
    await app.listen({ port: PORT, host: HOST });
    console.log(`GoSupportMe API running on http://${HOST}:${PORT}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }

  const gracefulShutdown = async (signal: string) => {
    console.log(`Received ${signal}, shutting down...`);
    await shutdownWorkers();
    await app.close();
    await db.end();
    process.exit(0);
  };

  process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
  process.on("SIGINT", () => gracefulShutdown("SIGINT"));
}

main();
