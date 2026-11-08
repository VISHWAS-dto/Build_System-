import type { PrismaClient } from "../../src/infra/database/prisma.client.js";
import cities from "../data/cities.json" with { type: "json" };

/** Reference data: safe to run in every environment, including production. */
export const seedCities = async (prisma: PrismaClient): Promise<void> => {
  for (const city of cities) {
    await prisma.city.upsert({
      where: { name_state: { name: city.name, state: city.state } },
      update: {},
      create: city,
    });
  }
  console.log(`  cities: ${cities.length}`);
};
