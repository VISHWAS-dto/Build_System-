import "dotenv/config";
import { createPrismaClient } from "../src/infra/database/prisma.client.js";
import { seedCities } from "./reference/cities.seed.js";
import { seedCinemas } from "./sample/cinemas.seed.js";
import { seedMovies } from "./sample/movies.seed.js";
import { seedScreens } from "./sample/screens.seed.js";
import { seedShows } from "./sample/shows.seed.js";

const databaseUrl = process.env["DATABASE_URL"];
if (!databaseUrl) {
  console.error("DATABASE_URL is not set.");
  process.exit(1);
}

const prisma = createPrismaClient(databaseUrl);

try {
  console.log("Seeding reference data...");
  await seedCities(prisma);

  if (process.env["NODE_ENV"] === "production") {
    console.log("NODE_ENV=production: skipping sample data.");
  } else {
    console.log("Seeding sample data...");
    await seedCinemas(prisma);
    await seedScreens(prisma);
    await seedMovies(prisma);
    await seedShows(prisma);
  }
  console.log("Seeding done.");
} catch (err) {
  console.error("Seeding failed:", err);
  process.exitCode = 1;
} finally {
  await prisma.$disconnect();
}
