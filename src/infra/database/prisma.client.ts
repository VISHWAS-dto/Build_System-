import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma/client.js";

export type { PrismaClient };

/** Single place that knows how to build a Prisma client (app, seeds and scripts share it). */
export const createPrismaClient = (databaseUrl: string): PrismaClient =>
  // The client connects lazily, on the first query.
  new PrismaClient({ adapter: new PrismaPg({ connectionString: databaseUrl }) });
