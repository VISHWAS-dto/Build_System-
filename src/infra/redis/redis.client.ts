import { Redis } from "ioredis";
import type { Config } from "../../bootstrap/config.js";

export const createRedisClient = (config: Config): Redis =>
  new Redis(config.REDIS_URL, {
    maxRetriesPerRequest: 2,
    enableReadyCheck: true,
  });
