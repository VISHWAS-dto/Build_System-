import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { idParamsDto, paginatedDto } from "../../common/schemas/common.dto.js";
import { createShowDto } from "./dto/create-show.dto.js";
import { listShowsQueryDto } from "./dto/list-shows.query.dto.js";
import { showResponseDto } from "./dto/show.response.dto.js";
import { createShowsController } from "./shows.controller.js";
import type { ShowsService } from "./shows.types.js";

export const showsRoutes =
  (service: ShowsService): FastifyPluginAsyncZod =>
  async (app) => {
    const controller = createShowsController(service);

    app.get(
      "/",
      {
        schema: {
          tags: ["Shows"],
          querystring: listShowsQueryDto,
          response: { 200: paginatedDto(showResponseDto) },
        },
      },
      controller.list,
    );

    app.get(
      "/:id",
      {
        schema: { tags: ["Shows"], params: idParamsDto, response: { 200: showResponseDto } },
      },
      controller.getById,
    );

    app.post(
      "/",
      {
        schema: { tags: ["Shows"], body: createShowDto, response: { 201: showResponseDto } },
      },
      controller.create,
    );
  };
