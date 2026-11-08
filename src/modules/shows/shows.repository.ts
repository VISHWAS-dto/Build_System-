import type { PrismaClient } from "../../generated/prisma/client.js";
import { toSkipTake } from "../../common/utils/pagination.js";
import type { ShowsRepository } from "./shows.types.js";

export const createShowsRepository = (prisma: PrismaClient): ShowsRepository => ({
  async findMany(filters) {
    const where = {
      movieId: filters.movieId,
      screen: filters.cinemaId ? { cinemaId: filters.cinemaId } : undefined,
      startsAt: filters.from && filters.to ? { gte: filters.from, lt: filters.to } : undefined,
    };
    const [data, total] = await prisma.$transaction([
      prisma.show.findMany({ where, ...toSkipTake(filters), orderBy: { startsAt: "asc" } }),
      prisma.show.count({ where }),
    ]);
    return { data, total };
  },

  findById: (id) => prisma.show.findUnique({ where: { id } }),

  findOverlapping: (screenId, startsAt, endsAt) =>
    prisma.show.findFirst({
      where: { screenId, startsAt: { lt: endsAt }, endsAt: { gt: startsAt } },
    }),

  create: (input) => prisma.show.create({ data: input }),
});
