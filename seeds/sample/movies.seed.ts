import type { PrismaClient } from "../../src/infra/database/prisma.client.js";
import movies from "../data/movies.json" with { type: "json" };

export const seedMovies = async (prisma: PrismaClient): Promise<void> => {
  for (const movie of movies) {
    await prisma.movie.upsert({
      where: { title_language: { title: movie.title, language: movie.language } },
      update: {},
      create: movie,
    });
  }
  console.log(`  movies: ${movies.length}`);
};
