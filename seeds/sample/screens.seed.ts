import type { PrismaClient } from "../../src/infra/database/prisma.client.js";
import cinemas from "../data/cinemas.json" with { type: "json" };

export const seedScreens = async (prisma: PrismaClient): Promise<void> => {
  let count = 0;
  for (const entry of cinemas) {
    const cinema = await prisma.cinema.findFirst({
      where: { name: entry.name, city: { name: entry.city, state: entry.state } },
    });
    if (!cinema) throw new Error(`Cinema ${entry.name} not found. Seed cinemas first.`);

    for (const name of entry.screens) {
      await prisma.screen.upsert({
        where: { cinemaId_name: { cinemaId: cinema.id, name } },
        update: {},
        create: { name, cinemaId: cinema.id },
      });
      count++;
    }
  }
  console.log(`  screens: ${count}`);
};
