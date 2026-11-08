import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { idParamsDto, paginatedDto } from "../../common/schemas/common.dto.js";
import { createCinemasController } from "./cinemas.controller.js";
import type { CinemasService } from "./cinemas.types.js";
import { cinemaResponseDto } from "./dto/cinema.response.dto.js";
import { createCinemaDto } from "./dto/create-cinema.dto.js";
import { listCinemasQueryDto } from "./dto/list-cinemas.query.dto.js";

export const cinemasRoutes =
  (service: CinemasService): FastifyPluginAsyncZod =>
  async (app) => {
    const controller = createCinemasController(service);

    app.get(
      "/",
      {
        schema: {
          tags: ["Cinemas"],
          querystring: listCinemasQueryDto,
          response: { 200: paginatedDto(cinemaResponseDto) },
        },
      },
      controller.list,
    );

    app.get(
      "/:id",
      {
        schema: { tags: ["Cinemas"], params: idParamsDto, response: { 200: cinemaResponseDto } },
      },
      controller.getById,
    );

    app.post(
      "/",
      {
        schema: { tags: ["Cinemas"], body: createCinemaDto, response: { 201: cinemaResponseDto } },
      },
      controller.create,
    );
  };
