import type { FastifyReply } from "fastify";
import type { IdParams } from "../../common/schemas/common.dto.js";
import type { CreateMovieInput } from "./dto/create-movie.dto.js";
import type { ListMoviesQuery } from "./dto/list-movies.query.dto.js";
import type { SearchMoviesQuery } from "./dto/search-movies.query.dto.js";
import type { MoviesService } from "./movies.types.js";

export const createMoviesController = (service: MoviesService) => ({
  list: (req: { query: ListMoviesQuery }) => service.list(req.query),

  search: (req: { query: SearchMoviesQuery }) => service.search(req.query),

  getById: (req: { params: IdParams }) => service.getById(req.params.id),

  create: async (req: { body: CreateMovieInput }, reply: FastifyReply) =>
    reply.code(201).send(await service.create(req.body)),
});
