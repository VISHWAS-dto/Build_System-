import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { idParamsDto, paginatedDto } from "../../common/schemas/common.dto.js";
import { createMovieDto } from "./dto/create-movie.dto.js";
import { listMoviesQueryDto } from "./dto/list-movies.query.dto.js";
import { movieResponseDto } from "./dto/movie.response.dto.js";
import { searchMoviesQueryDto } from "./dto/search-movies.query.dto.js";
import { createMoviesController } from "./movies.controller.js";
import type { MoviesService } from "./movies.types.js";

export const moviesRoutes =
  (service: MoviesService): FastifyPluginAsyncZod =>
  async (app) => {
    const controller = createMoviesController(service);

    app.get(
      "/",
      {
        schema: {
          tags: ["Movies"],
          querystring: listMoviesQueryDto,
          response: { 200: paginatedDto(movieResponseDto) },
        },
      },
      controller.list,
    );

    app.get(
      "/search",
      {
        schema: {
          tags: ["Movies"],
          summary: "Search movies by title (Elasticsearch)",
          querystring: searchMoviesQueryDto,
          response: { 200: paginatedDto(movieResponseDto) },
        },
      },
      controller.search,
    );

    app.get(
      "/:id",
      {
        schema: { tags: ["Movies"], params: idParamsDto, response: { 200: movieResponseDto } },
      },
      controller.getById,
    );

    app.post(
      "/",
      {
        schema: { tags: ["Movies"], body: createMovieDto, response: { 201: movieResponseDto } },
      },
      controller.create,
    );
  };
