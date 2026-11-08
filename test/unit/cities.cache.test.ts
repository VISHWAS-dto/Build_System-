import { describe, expect, it } from "vitest";
import { createCachedCitiesRepository } from "../../src/modules/cities/cities.cache.js";
import type { CitiesRepository, City } from "../../src/modules/cities/cities.types.js";
import type { CacheService } from "../../src/infra/redis/redis.types.js";

const city: City = {
  id: "11111111-1111-4111-8111-111111111111",
  name: "Pune",
  state: "Maharashtra",
  createdAt: new Date(),
};

const memoryCache = (): CacheService => {
  const store = new Map<string, unknown>();
  const cache: CacheService = {
    get: async <T>(key: string) => (store.get(key) as T | undefined) ?? null,
    set: async (key, value) => void store.set(key, value),
    del: async (...keys) => keys.forEach((k) => store.delete(k)),
    delByPrefix: async (prefix) => {
      for (const k of [...store.keys()]) if (k.startsWith(prefix)) store.delete(k);
    },
    getOrSet: async <T>(key: string, loader: () => Promise<T>) => {
      const hit = await cache.get<T>(key);
      if (hit !== null) return hit;
      const value = await loader();
      if (value !== null && value !== undefined) await cache.set(key, value);
      return value;
    },
  };
  return cache;
};

const countingRepo = () => {
  const calls = { findById: 0 };
  const repo: CitiesRepository = {
    findMany: async () => ({ data: [city], total: 1 }),
    findById: async () => {
      calls.findById++;
      return city;
    },
    findByNameAndState: async () => null,
    create: async () => city,
  };
  return { repo, calls };
};

describe("cities cache decorator", () => {
  it("serves repeated reads from cache", async () => {
    const { repo, calls } = countingRepo();
    const cached = createCachedCitiesRepository(repo, memoryCache());
    await cached.findById(city.id);
    await cached.findById(city.id);
    expect(calls.findById).toBe(1);
  });

  it("invalidates the cache after create", async () => {
    const { repo, calls } = countingRepo();
    const cached = createCachedCitiesRepository(repo, memoryCache());
    await cached.findById(city.id);
    await cached.create({ name: "Pune", state: "Maharashtra" });
    await cached.findById(city.id);
    expect(calls.findById).toBe(2);
  });
});
