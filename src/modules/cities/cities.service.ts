import { ConflictError, NotFoundError } from "../../common/errors/index.js";
import { toPaginated } from "../../common/utils/pagination.js";
import type { CitiesRepository, CitiesService } from "./cities.types.js";

export const createCitiesService = (repo: CitiesRepository): CitiesService => ({
  async list(query) {
    const { data, total } = await repo.findMany(query);
    return toPaginated(data, total, query);
  },

  async getById(id) {
    const city = await repo.findById(id);
    if (!city) throw new NotFoundError("City not found", "CITY_NOT_FOUND");
    return city;
  },

  async create(input) {
    if (await repo.findByNameAndState(input.name, input.state)) {
      throw new ConflictError("City already exists", "CITY_ALREADY_EXISTS");
    }
    return repo.create(input);
  },
});
