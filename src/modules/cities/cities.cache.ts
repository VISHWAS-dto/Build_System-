import type { CacheService } from "../../infra/redis/redis.types.js";
import type { CitiesRepository } from "./cities.types.js";

const PREFIX = "cities:";

/** Cache-aside decorator: same interface as the repository, so the service is unchanged. */
export const createCachedCitiesRepository = (
  repo: CitiesRepository,
  cache: CacheService,
): CitiesRepository => ({
  findMany: (query) =>
    cache.getOrSet(`${PREFIX}list:${query.page}:${query.limit}`, () => repo.findMany(query)),

  findById: (id) => cache.getOrSet(`${PREFIX}id:${id}`, () => repo.findById(id)),

  // Used for duplicate checks on write, so it always reads the source of truth.
  findByNameAndState: (name, state) => repo.findByNameAndState(name, state),

  async create(input) {
    const city = await repo.create(input);
    await cache.delByPrefix(PREFIX);
    return city;
  },
});
