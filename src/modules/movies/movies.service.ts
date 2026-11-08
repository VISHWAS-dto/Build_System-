import { NotFoundError } from "../../common/errors/index.js";
import { toPaginated } from "../../common/utils/pagination.js";
import type { MoviesRepository, MoviesSearch, MoviesService } from "./movies.types.js";

export const createMoviesService = (
  repo: MoviesRepository,
  moviesSearch: MoviesSearch,
): MoviesService => ({
  async list(query) {
    const { data, total } = await repo.findMany(query);
    return toPaginated(data, total, query);
  },

  async search(query) {
    const { data, total } = await moviesSearch.search(query);
    return toPaginated(data, total, query);
  },

  async getById(id) {
    const movie = await repo.findById(id);
    if (!movie) throw new NotFoundError("Movie not found", "MOVIE_NOT_FOUND");
    return movie;
  },

  async create(input) {
    const movie = await repo.create(input);
    await moviesSearch.index(movie);
    return movie;
  },
});
