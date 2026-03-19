import { FastifyInstance } from "fastify";
export declare function registerTelemetry(app: FastifyInstance): void;
export declare function structuredLog(level: "info" | "warn" | "error", message: string, data?: Record<string, unknown>): void;
