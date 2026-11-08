import { BadRequestError, ConflictError, NotFoundError } from "../../common/errors/index.js";
import { toPaginated } from "../../common/utils/pagination.js";
import type { CinemasService } from "../cinemas/cinemas.types.js";
import type { MoviesService } from "../movies/movies.types.js";
import type { ShowsRepository, ShowsService } from "./shows.types.js";

const DAY_MS = 24 * 60 * 60 * 1000;
const MINUTE_MS = 60 * 1000;

export const createShowsService = (
  repo: ShowsRepository,
  moviesService: MoviesService,
  cinemasService: CinemasService,
): ShowsService => ({
  async list(query) {
    const from = query.date ? new Date(`${query.date}T00:00:00.000Z`) : undefined;
    const to = from ? new Date(from.getTime() + DAY_MS) : undefined;
    const { data, total } = await repo.findMany({ ...query, from, to });
    return toPaginated(data, total, query);
  },

  async getById(id) {
    const show = await repo.findById(id);
    if (!show) throw new NotFoundError("Show not found", "SHOW_NOT_FOUND");
    return show;
  },

  async create(input) {
    const movie = await moviesService.getById(input.movieId);
    await cinemasService.getScreen(input.screenId);

    if (input.startsAt.getTime() <= Date.now()) {
      throw new BadRequestError("Show must start in the future", "SHOW_IN_PAST");
    }

    const endsAt = new Date(input.startsAt.getTime() + movie.durationMin * MINUTE_MS);
    if (await repo.findOverlapping(input.screenId, input.startsAt, endsAt)) {
      throw new ConflictError("Screen already has a show in this time slot", "SHOW_OVERLAP");
    }

    return repo.create({ ...input, endsAt });
  },
});
