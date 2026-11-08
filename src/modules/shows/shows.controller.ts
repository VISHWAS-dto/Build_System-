import type { FastifyReply } from "fastify";
import type { IdParams } from "../../common/schemas/common.dto.js";
import type { CreateShowInput } from "./dto/create-show.dto.js";
import type { ListShowsQuery } from "./dto/list-shows.query.dto.js";
import type { ShowsService } from "./shows.types.js";

export const createShowsController = (service: ShowsService) => ({
  list: (req: { query: ListShowsQuery }) => service.list(req.query),

  getById: (req: { params: IdParams }) => service.getById(req.params.id),

  create: async (req: { body: CreateShowInput }, reply: FastifyReply) =>
    reply.code(201).send(await service.create(req.body)),
});
