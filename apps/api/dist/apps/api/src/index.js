"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const cors_1 = __importDefault(require("@fastify/cors"));
const jwt_1 = __importDefault(require("@fastify/jwt"));
const rate_limit_1 = __importDefault(require("@fastify/rate-limit"));
const fastify_plugin_1 = __importDefault(require("fastify-plugin"));
const events_1 = require("./routes/events");
const donations_1 = require("./routes/donations");
const fundraisers_1 = require("./routes/fundraisers");
const notifications_1 = require("./routes/notifications");
const recommendations_1 = require("./routes/recommendations");
const badges_1 = require("./routes/badges");
const charities_1 = require("./routes/charities");
const feed_1 = require("./routes/feed");
const follows_1 = require("./routes/follows");
const auth_1 = require("./routes/auth");
const telemetry_1 = require("./services/telemetry");
const index_1 = require("./worker/index");
const client_1 = require("./db/client");
const PORT = parseInt(process.env.PORT ?? "3001", 10);
const HOST = process.env.HOST ?? "0.0.0.0";
async function buildApp() {
    const app = (0, fastify_1.default)({
        bodyLimit: 8 * 1024 * 1024,
        logger: {
            level: process.env.LOG_LEVEL ?? "info",
            transport: process.env.NODE_ENV !== "production"
                ? { target: "pino-pretty" }
                : undefined,
        },
        genReqId: () => {
            const { randomUUID } = require("crypto");
            return randomUUID();
        },
    });
    // ─── Plugins ────────────────────────────────────────────────────────────────
    await app.register(cors_1.default, {
        origin: process.env.CORS_ORIGIN?.split(",") ?? ["http://localhost:3000"],
        credentials: true,
    });
    await app.register(rate_limit_1.default, {
        max: 200,
        timeWindow: "1 minute",
    });
    await app.register(jwt_1.default, {
        secret: process.env.JWT_SECRET ?? "gosupportme-dev-secret-change-in-production",
    });
    // ─── Telemetry ───────────────────────────────────────────────────────────────
    (0, telemetry_1.registerTelemetry)(app);
    // ─── Health ──────────────────────────────────────────────────────────────────
    app.get("/health", async (_req, reply) => {
        try {
            await client_1.db.query("SELECT 1");
            return reply.send({ status: "ok", db: "connected", ts: new Date().toISOString() });
        }
        catch {
            return reply.status(503).send({ status: "degraded", db: "disconnected" });
        }
    });
    // ─── Routes ──────────────────────────────────────────────────────────────────
    await app.register((0, fastify_plugin_1.default)(events_1.eventsRoutes));
    await app.register((0, fastify_plugin_1.default)(donations_1.donationsRoutes));
    await app.register((0, fastify_plugin_1.default)(fundraisers_1.fundraisersRoutes));
    await app.register((0, fastify_plugin_1.default)(notifications_1.notificationsRoutes));
    await app.register((0, fastify_plugin_1.default)(recommendations_1.recommendationsRoutes));
    await app.register((0, fastify_plugin_1.default)(badges_1.badgesRoutes));
    await app.register((0, fastify_plugin_1.default)(charities_1.charitiesRoutes));
    await app.register((0, fastify_plugin_1.default)(feed_1.feedRoutes));
    await app.register((0, fastify_plugin_1.default)(follows_1.followsRoutes));
    await app.register((0, fastify_plugin_1.default)(auth_1.authRoutes));
    return app;
}
async function main() {
    const app = await buildApp();
    // Start background workers
    const { shutdown: shutdownWorkers } = (0, index_1.startWorkers)();
    try {
        await app.listen({ port: PORT, host: HOST });
        console.log(`GoSupportMe API running on http://${HOST}:${PORT}`);
    }
    catch (err) {
        app.log.error(err);
        process.exit(1);
    }
    const gracefulShutdown = async (signal) => {
        console.log(`Received ${signal}, shutting down...`);
        await shutdownWorkers();
        await app.close();
        await client_1.db.end();
        process.exit(0);
    };
    process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
    process.on("SIGINT", () => gracefulShutdown("SIGINT"));
}
main();
