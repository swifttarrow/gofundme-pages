import Redis from "ioredis";
import type { ConnectionOptions } from "bullmq";

const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";

// Parse the Redis URL into host/port for BullMQ connection options
function parseRedisUrl(url: string): { host: string; port: number; password?: string } {
  try {
    const parsed = new URL(url);
    return {
      host: parsed.hostname || "localhost",
      port: parseInt(parsed.port || "6379", 10),
      ...(parsed.password ? { password: parsed.password } : {}),
    };
  } catch {
    return { host: "localhost", port: 6379 };
  }
}

export const redis = new Redis(redisUrl, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
  lazyConnect: true,
});

redis.on("error", (err) => {
  console.error("Redis error:", err);
});

/** BullMQ connection options — do NOT pass an ioredis client; BullMQ bundles its own ioredis */
export function createBullMQConnection(): ConnectionOptions {
  return parseRedisUrl(redisUrl);
}
