import Fastify, { type FastifyInstance } from "fastify";
import { serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";
import { registerRoutes } from "../routes.js";
import { loadConfig, type Config } from "./config.js";
import { initDatabase } from "./database.js";
import { initElasticsearch } from "./elasticsearch.js";
import { initErrorHandler } from "./error-handler.js";
import { buildLoggerOptions } from "./logger.js";
import { initMonitoring } from "./monitoring.js";
import { initRedis } from "./redis.js";
import { initSecurity } from "./security.js";
import { initSwagger } from "./swagger.js";
import { initTelemetry } from "./telemetry.js";

/**
 * Single entry point for application initialization.
 * Builds the app but does not listen, so tests can use it without a port.
 */
export const bootstrap = async (config: Config = loadConfig()): Promise<FastifyInstance> => {
  initTelemetry(config);

  const app = Fastify({ logger: buildLoggerOptions(config) });
  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  // Infrastructure first: security (rate-limit store) and modules depend on it.
  initDatabase(app, config);
  initRedis(app, config);
  initElasticsearch(app, config);

  await initSecurity(app, config);
  await initSwagger(app, config);
  initErrorHandler(app);
  await registerRoutes(app);
  initMonitoring(app, config);

  return app;
};
