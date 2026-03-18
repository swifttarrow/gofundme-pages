import { FastifyPluginCallback } from "fastify";
import { randomUUID } from "crypto";
import fp from "fastify-plugin";

const requestIdPlugin: FastifyPluginCallback = (fastify, _opts, done) => {
  fastify.addHook("onRequest", async (request) => {
    const existingId =
      (request.headers["x-request-id"] as string | undefined) || randomUUID();
    request.id = existingId;
  });

  fastify.addHook("onSend", async (request, reply) => {
    void reply.header("x-request-id", request.id);
  });

  done();
};

export default fp(requestIdPlugin, { name: "request-id" });
