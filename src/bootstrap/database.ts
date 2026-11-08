import type { FastifyInstance } from "fastify";
import { createPrismaClient, type PrismaClient } from "../infra/database/prisma.client.js";
import type { Config } from "./config.js";

declare module "fastify" {
  interface FastifyInstance {
    prisma: PrismaClient;
  }
}

export const initDatabase = (app: FastifyInstance, config: Config): void => {
  const prisma = createPrismaClient(config.DATABASE_URL);

  app.decorate("prisma", prisma);
  app.addHook("onClose", async () => {
    await prisma.$disconnect();
  });
};
