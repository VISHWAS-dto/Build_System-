import type { PrismaClient } from "../../generated/prisma/client.js";
import { toSkipTake } from "../../common/utils/pagination.js";
import type { MoviesRepository } from "./movies.types.js";

export const createMoviesRepository = (prisma: PrismaClient): MoviesRepository => ({
  async findMany(query) {
    const [data, total] = await prisma.$transaction([
      prisma.movie.findMany({ ...toSkipTake(query), orderBy: { title: "asc" } }),
      prisma.movie.count(),
    ]);
    return { data, total };
  },

  findById: (id) => prisma.movie.findUnique({ where: { id } }),

  create: (input) => prisma.movie.create({ data: input }),
});
