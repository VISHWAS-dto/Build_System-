import type { PrismaClient } from "../../generated/prisma/client.js";
import { toSkipTake } from "../../common/utils/pagination.js";
import type { CinemasRepository } from "./cinemas.types.js";

export const createCinemasRepository = (prisma: PrismaClient): CinemasRepository => ({
  async findMany(query) {
    const where = { cityId: query.cityId };
    const [data, total] = await prisma.$transaction([
      prisma.cinema.findMany({ where, ...toSkipTake(query), orderBy: { name: "asc" } }),
      prisma.cinema.count({ where }),
    ]);
    return { data, total };
  },

  findById: (id) => prisma.cinema.findUnique({ where: { id } }),

  findScreenById: (id) => prisma.screen.findUnique({ where: { id } }),

  create: (input) => prisma.cinema.create({ data: input }),
});
