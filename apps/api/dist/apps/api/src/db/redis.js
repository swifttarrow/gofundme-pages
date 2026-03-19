"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redis = void 0;
exports.createBullMQConnection = createBullMQConnection;
const ioredis_1 = __importDefault(require("ioredis"));
const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";
// Parse the Redis URL into host/port for BullMQ connection options
function parseRedisUrl(url) {
    try {
        const parsed = new URL(url);
        return {
            host: parsed.hostname || "localhost",
            port: parseInt(parsed.port || "6379", 10),
            ...(parsed.password ? { password: parsed.password } : {}),
        };
    }
    catch {
        return { host: "localhost", port: 6379 };
    }
}
exports.redis = new ioredis_1.default(redisUrl, {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
    lazyConnect: true,
});
exports.redis.on("error", (err) => {
    console.error("Redis error:", err);
});
/** BullMQ connection options — do NOT pass an ioredis client; BullMQ bundles its own ioredis */
function createBullMQConnection() {
    return parseRedisUrl(redisUrl);
}
