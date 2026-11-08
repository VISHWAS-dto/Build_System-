import type { FastifyInstance } from "fastify";
import type { Config } from "./config.js";

/**
 * Monitoring hooks (metrics, error reporting).
 * Skeleton: logs slow requests. Plug Sentry/Prometheus here later.
 */
export const initMonitoring = (app: FastifyInstance, config: Config): void => {
  if (!config.MONITORING_ENABLED) return;

  app.addHook("onResponse", async (request, reply) => {
    const ms = reply.elapsedTime;
    if (ms > 1000) {
      request.log.warn({ url: request.url, ms }, "slow request");
    }
  });
};
