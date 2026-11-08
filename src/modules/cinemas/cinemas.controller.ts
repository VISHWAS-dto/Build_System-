import type { FastifyReply } from "fastify";
import type { IdParams } from "../../common/schemas/common.dto.js";
import type { CinemasService } from "./cinemas.types.js";
import type { CreateCinemaInput } from "./dto/create-cinema.dto.js";
import type { ListCinemasQuery } from "./dto/list-cinemas.query.dto.js";

export const createCinemasController = (service: CinemasService) => ({
  list: (req: { query: ListCinemasQuery }) => service.list(req.query),

  getById: (req: { params: IdParams }) => service.getById(req.params.id),

  create: async (req: { body: CreateCinemaInput }, reply: FastifyReply) =>
    reply.code(201).send(await service.create(req.body)),
});
