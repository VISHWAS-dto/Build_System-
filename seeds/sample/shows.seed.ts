import type { PrismaClient } from "../../src/infra/database/prisma.client.js";

const SLOT_HOURS_UTC = [10, 14, 19];
const DAYS_AHEAD = 2;
const PRICE_PAISE = 25000;
const MINUTE_MS = 60 * 1000;

/**
 * Creates shows for the next few days. Slots are 4+ hours apart, so they never
 * overlap even for the longest sample movie. Re-running on the same day adds nothing.
 */
export const seedShows = async (prisma: PrismaClient): Promise<void> => {
  const movies = await prisma.movie.findMany({ orderBy: { title: "asc" } });
  const screens = await prisma.screen.findMany({ orderBy: [{ cinemaId: "asc" }, { name: "asc" }] });
  if (movies.length === 0 || screens.length === 0) {
    throw new Error("Movies and screens are required. Seed them first.");
  }

  const tomorrow = new Date();
  tomorrow.setUTCHours(0, 0, 0, 0);
  tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);

  let created = 0;
  for (const [screenIdx, screen] of screens.entries()) {
    for (let day = 0; day < DAYS_AHEAD; day++) {
      for (const [slotIdx, hour] of SLOT_HOURS_UTC.entries()) {
        const startsAt = new Date(tomorrow);
        startsAt.setUTCDate(startsAt.getUTCDate() + day);
        startsAt.setUTCHours(hour);

        const movie = movies[(screenIdx + slotIdx) % movies.length]!;
        const endsAt = new Date(startsAt.getTime() + movie.durationMin * MINUTE_MS);

        const exists = await prisma.show.findFirst({ where: { screenId: screen.id, startsAt } });
        if (exists) continue;

        await prisma.show.create({
          data: { movieId: movie.id, screenId: screen.id, startsAt, endsAt, price: PRICE_PAISE },
        });
        created++;
      }
    }
  }
  console.log(`  shows: ${created} new`);
};
