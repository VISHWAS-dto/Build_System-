import type { CacheService } from "../../infra/redis/redis.types.js";
import type { MoviesRepository } from "./movies.types.js";

const PREFIX = "movies:";

/** Cache-aside decorator: same interface as the repository, so the service is unchanged. */
export const createCachedMoviesRepository = (
  repo: MoviesRepository,
  cache: CacheService,
): MoviesRepository => ({
  findMany: (query) =>
    cache.getOrSet(`${PREFIX}list:${query.page}:${query.limit}`, () => repo.findMany(query)),

  findById: (id) => cache.getOrSet(`${PREFIX}id:${id}`, () => repo.findById(id)),

  async create(input) {
    const movie = await repo.create(input);
    await cache.delByPrefix(PREFIX);
    return movie;
  },
});
