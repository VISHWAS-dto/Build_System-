import type { FastifyServerOptions } from "fastify";
import type { Config } from "./config.js";

export const buildLoggerOptions = (config: Config): FastifyServerOptions["logger"] => ({
  level: config.LOG_LEVEL,
  redact: ["req.headers.authorization", "req.headers.cookie"],
  ...(config.NODE_ENV === "development"
    ? {
        transport: {
          target: "pino-pretty",
          options: { translateTime: "HH:MM:ss", ignore: "pid,hostname" },
        },
      }
    : {}),
});
