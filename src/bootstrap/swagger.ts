import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import type { FastifyInstance } from "fastify";
import { jsonSchemaTransform } from "fastify-type-provider-zod";
import type { Config } from "./config.js";

export const initSwagger = async (app: FastifyInstance, config: Config): Promise<void> => {
  if (config.NODE_ENV === "production") return;

  await app.register(swagger, {
    openapi: { info: { title: "Book Show API", version: "0.1.0" } },
    transform: jsonSchemaTransform,
  });
  await app.register(swaggerUi, { routePrefix: "/docs" });
};
