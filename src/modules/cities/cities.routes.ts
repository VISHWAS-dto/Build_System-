import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { idParamsDto, paginatedDto } from "../../common/schemas/common.dto.js";
import { createCitiesController } from "./cities.controller.js";
import type { CitiesService } from "./cities.types.js";
import { cityResponseDto } from "./dto/city.response.dto.js";
import { createCityDto } from "./dto/create-city.dto.js";
import { listCitiesQueryDto } from "./dto/list-cities.query.dto.js";

export const citiesRoutes =
  (service: CitiesService): FastifyPluginAsyncZod =>
  async (app) => {
    const controller = createCitiesController(service);

    app.get(
      "/",
      {
        schema: {
          tags: ["Cities"],
          querystring: listCitiesQueryDto,
          response: { 200: paginatedDto(cityResponseDto) },
        },
      },
      controller.list,
    );

    app.get(
      "/:id",
      {
        schema: { tags: ["Cities"], params: idParamsDto, response: { 200: cityResponseDto } },
      },
      controller.getById,
    );

    app.post(
      "/",
      {
        schema: { tags: ["Cities"], body: createCityDto, response: { 201: cityResponseDto } },
      },
      controller.create,
    );
  };
