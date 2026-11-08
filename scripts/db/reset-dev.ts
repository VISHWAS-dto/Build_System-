import "dotenv/config";
import { createPrismaClient } from "../../src/infra/database/prisma.client.js";
import { assertNotProduction, requireConfirmation } from "../lib/guards.js";

// DESTRUCTIVE: deletes all rows from every table. Development only.
// Usage: npm run db:reset -- --yes
assertNotProduction("db:reset");
requireConfirmation("db:reset");

const databaseUrl = process.env["DATABASE_URL"];
if (!databaseUrl) {
  console.error("DATABASE_URL is not set.");
  process.exit(1);
}

const prisma = createPrismaClient(databaseUrl);

try {
  // Children first, to respect foreign keys.
  await prisma.$transaction([
    prisma.show.deleteMany(),
    prisma.screen.deleteMany(),
    prisma.cinema.deleteMany(),
    prisma.movie.deleteMany(),
    prisma.city.deleteMany(),
  ]);
  console.log("All tables cleared. Run `npm run prisma:seed` to re-seed.");
} finally {
  await prisma.$disconnect();
}
