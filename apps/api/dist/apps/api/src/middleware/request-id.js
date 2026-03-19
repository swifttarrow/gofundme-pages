"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
const fastify_plugin_1 = __importDefault(require("fastify-plugin"));
const requestIdPlugin = (fastify, _opts, done) => {
    fastify.addHook("onRequest", async (request) => {
        const existingId = request.headers["x-request-id"] || (0, crypto_1.randomUUID)();
        request.id = existingId;
    });
    fastify.addHook("onSend", async (request, reply) => {
        void reply.header("x-request-id", request.id);
    });
    done();
};
exports.default = (0, fastify_plugin_1.default)(requestIdPlugin, { name: "request-id" });
