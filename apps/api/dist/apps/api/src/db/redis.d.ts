import Redis from "ioredis";
import type { ConnectionOptions } from "bullmq";
export declare const redis: Redis;
/** BullMQ connection options — do NOT pass an ioredis client; BullMQ bundles its own ioredis */
export declare function createBullMQConnection(): ConnectionOptions;
