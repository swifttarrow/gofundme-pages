import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { pageViewsTotal } from "../observability/metrics";

const PageViewSchema = z.object({
  pageType: z.enum(["fundraiser", "community", "profile"]),
});

export async function telemetryRoutes(app: FastifyInstance): Promise<void> {
  /** POST /api/telemetry/page-view — lightweight client-reported page views */
  app.post("/api/telemetry/page-view", async (request: FastifyRequest, reply: FastifyReply) => {
    const parse = PageViewSchema.safeParse(request.body);
    if (!parse.success) {
      return reply.status(400).send({ error: "Validation failed", details: parse.error.flatten() });
    }

    pageViewsTotal.inc({ page_type: parse.data.pageType });
    return reply.status(204).send();
  });
}
