import type { FastifyReply } from "fastify";
import type { IdParams } from "../../common/schemas/common.dto.js";
import type { CitiesService } from "./cities.types.js";
import type { CreateCityInput } from "./dto/create-city.dto.js";
import type { ListCitiesQuery } from "./dto/list-cities.query.dto.js";

export const createCitiesController = (service: CitiesService) => ({
  list: (req: { query: ListCitiesQuery }) => service.list(req.query),

  getById: (req: { params: IdParams }) => service.getById(req.params.id),

  create: async (req: { body: CreateCityInput }, reply: FastifyReply) =>
    reply.code(201).send(await service.create(req.body)),
});
