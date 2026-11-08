import type { PrismaClient } from "../../src/infra/database/prisma.client.js";
import cinemas from "../data/cinemas.json" with { type: "json" };

export const seedCinemas = async (prisma: PrismaClient): Promise<void> => {
  for (const cinema of cinemas) {
    const city = await prisma.city.findUnique({
      where: { name_state: { name: cinema.city, state: cinema.state } },
    });
    if (!city) throw new Error(`City ${cinema.city} not found. Seed reference data first.`);

    await prisma.cinema.upsert({
      where: { cityId_name: { cityId: city.id, name: cinema.name } },
      update: {},
      create: { name: cinema.name, address: cinema.address, cityId: city.id },
    });
  }
  console.log(`  cinemas: ${cinemas.length}`);
};
