import "fastify";

declare module "fastify" {
  interface FastifyRequest {
    /** Set on mutation routes so request.completed logs can include event correlation. */
    observabilityEventId?: string;
  }
}
