import type { PrismaClient } from "../../generated/prisma/client.js";
import { toSkipTake } from "../../common/utils/pagination.js";
import type { CitiesRepository } from "./cities.types.js";

export const createCitiesRepository = (prisma: PrismaClient): CitiesRepository => ({
  async findMany(query) {
    const [data, total] = await prisma.$transaction([
      prisma.city.findMany({ ...toSkipTake(query), orderBy: { name: "asc" } }),
      prisma.city.count(),
    ]);
    return { data, total };
  },

  findById: (id) => prisma.city.findUnique({ where: { id } }),

  findByNameAndState: (name, state) =>
    prisma.city.findUnique({ where: { name_state: { name, state } } }),

  create: (input) => prisma.city.create({ data: input }),
});
