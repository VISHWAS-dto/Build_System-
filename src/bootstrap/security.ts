import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import rateLimit from "@fastify/rate-limit";
import type { FastifyInstance } from "fastify";
import type { Config } from "./config.js";

export const initSecurity = async (app: FastifyInstance, config: Config): Promise<void> => {
  // Docs UI needs inline assets, so CSP is relaxed outside production.
  await app.register(helmet, {
    contentSecurityPolicy: config.NODE_ENV === "production",
  });
  await app.register(cors, {
    origin: config.CORS_ORIGIN === "*" ? true : config.CORS_ORIGIN.split(","),
  });
  // With Redis the rate-limit counters are shared across instances.
  await app.register(rateLimit, {
    max: config.RATE_LIMIT_MAX,
    timeWindow: "1 minute",
    // If Redis is down, let requests through instead of failing them.
    skipOnError: true,
    ...(app.redis ? { redis: app.redis } : {}),
  });
};
