import type { CacheService } from "./redis.types.js";

/** Used when Redis is disabled: every read is a miss, every write is ignored. */
export const createNoopCache = (): CacheService => ({
  get: async () => null,
  set: async () => {},
  del: async () => {},
  delByPrefix: async () => {},
  getOrSet: (_key, loader) => loader(),
});
