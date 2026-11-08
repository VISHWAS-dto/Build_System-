import type { FastifyInstance } from "fastify";
import type { Redis } from "ioredis";
import { createRedisCache } from "../infra/redis/cache.service.js";
import { createNoopCache } from "../infra/redis/noop-cache.service.js";
import { createRedisClient } from "../infra/redis/redis.client.js";
import type { CacheService } from "../infra/redis/redis.types.js";
import type { Config } from "./config.js";

declare module "fastify" {
  interface FastifyInstance {
    /** Raw client. `null` when Redis is disabled. Prefer `cache` in modules. */
    redis: Redis | null;
    cache: CacheService;
  }
}

export const initRedis = (app: FastifyInstance, config: Config): void => {
  if (!config.REDIS_ENABLED) {
    app.decorate("redis", null);
    app.decorate("cache", createNoopCache());
    return;
  }

  const redis = createRedisClient(config);
  redis.on("error", (err) => app.log.error({ err }, "redis error"));

  app.decorate("redis", redis);
  app.decorate(
    "cache",
    createRedisCache(redis, {
      keyPrefix: config.REDIS_KEY_PREFIX,
      defaultTtlSeconds: config.CACHE_TTL_SECONDS,
      logger: app.log,
    }),
  );
  app.addHook("onClose", async () => {
    await redis.quit().catch(() => redis.disconnect());
  });
};
