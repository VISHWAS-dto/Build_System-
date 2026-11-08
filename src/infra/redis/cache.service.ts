import type { FastifyBaseLogger } from "fastify";
import type { Redis } from "ioredis";
import type { CacheService } from "./redis.types.js";

interface CacheOptions {
  keyPrefix: string;
  defaultTtlSeconds: number;
  logger: FastifyBaseLogger;
}

/**
 * Redis-backed cache. A Redis failure must never break a request:
 * every error is logged and treated as a cache miss.
 */
export const createRedisCache = (
  redis: Redis,
  { keyPrefix, defaultTtlSeconds, logger }: CacheOptions,
): CacheService => {
  const k = (key: string) => `${keyPrefix}${key}`;

  const safe = async <R>(op: string, fallback: R, fn: () => Promise<R>): Promise<R> => {
    try {
      return await fn();
    } catch (err) {
      logger.warn({ err, op }, "cache operation failed");
      return fallback;
    }
  };

  const service: CacheService = {
    get: <T>(key: string) =>
      safe<T | null>("get", null, async () => {
        const raw = await redis.get(k(key));
        return raw === null ? null : (JSON.parse(raw) as T);
      }),

    set: (key, value, ttlSeconds = defaultTtlSeconds) =>
      safe("set", undefined, async () => {
        await redis.set(k(key), JSON.stringify(value), "EX", ttlSeconds);
      }),

    del: (...keys) =>
      safe("del", undefined, async () => {
        if (keys.length > 0) await redis.del(...keys.map(k));
      }),

    delByPrefix: (prefix) =>
      safe("delByPrefix", undefined, async () => {
        const stream = redis.scanStream({ match: `${k(prefix)}*`, count: 100 });
        for await (const keys of stream as AsyncIterable<string[]>) {
          if (keys.length > 0) await redis.del(...keys);
        }
      }),

    async getOrSet<T>(key: string, loader: () => Promise<T>, ttlSeconds?: number) {
      const cached = await service.get<T>(key);
      if (cached !== null) return cached;
      const value = await loader();
      if (value !== null && value !== undefined) await service.set(key, value, ttlSeconds);
      return value;
    },
  };

  return service;
};
