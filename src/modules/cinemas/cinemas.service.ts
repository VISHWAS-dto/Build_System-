import { NotFoundError } from "../../common/errors/index.js";
import { toPaginated } from "../../common/utils/pagination.js";
import type { CitiesService } from "../cities/cities.types.js";
import type { CinemasRepository, CinemasService } from "./cinemas.types.js";

export const createCinemasService = (
  repo: CinemasRepository,
  citiesService: CitiesService,
): CinemasService => ({
  async list(query) {
    const { data, total } = await repo.findMany(query);
    return toPaginated(data, total, query);
  },

  async getById(id) {
    const cinema = await repo.findById(id);
    if (!cinema) throw new NotFoundError("Cinema not found", "CINEMA_NOT_FOUND");
    return cinema;
  },

  async getScreen(id) {
    const screen = await repo.findScreenById(id);
    if (!screen) throw new NotFoundError("Screen not found", "SCREEN_NOT_FOUND");
    return screen;
  },

  async create(input) {
    await citiesService.getById(input.cityId);
    return repo.create(input);
  },
});
