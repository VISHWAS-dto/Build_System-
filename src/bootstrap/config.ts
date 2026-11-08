import "dotenv/config";
import { z } from "zod";

const boolFromString = z
  .enum(["true", "false"])
  .default("false")
  .transform((v) => v === "true");

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  HOST: z.string().default("0.0.0.0"),
  PORT: z.coerce.number().int().positive().default(3000),
  LOG_LEVEL: z.enum(["fatal", "error", "warn", "info", "debug", "trace", "silent"]).default("info"),
  DATABASE_URL: z.url(),
  CORS_ORIGIN: z.string().default("*"),
  RATE_LIMIT_MAX: z.coerce.number().int().positive().default(100),
  TELEMETRY_ENABLED: boolFromString,
  MONITORING_ENABLED: boolFromString,

  REDIS_ENABLED: boolFromString,
  REDIS_URL: z.string().default("redis://localhost:6379"),
  REDIS_KEY_PREFIX: z.string().default("bookshow:"),
  CACHE_TTL_SECONDS: z.coerce.number().int().positive().default(60),

  ELASTICSEARCH_ENABLED: boolFromString,
  ELASTICSEARCH_NODE: z.string().default("http://localhost:9200"),
  ELASTICSEARCH_USERNAME: z.string().optional(),
  ELASTICSEARCH_PASSWORD: z.string().optional(),
  ELASTICSEARCH_INDEX_PREFIX: z.string().default("bookshow"),
});

export type Config = z.infer<typeof envSchema>;

export const loadConfig = (source: NodeJS.ProcessEnv = process.env): Config => {
  const parsed = envSchema.safeParse(source);
  if (!parsed.success) {
    // Logger is not ready yet, so fail fast with a readable message.
    console.error("Invalid environment configuration:");
    console.error(z.prettifyError(parsed.error));
    process.exit(1);
  }
  return parsed.data;
};
