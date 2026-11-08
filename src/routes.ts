import type { FastifyInstance } from "fastify";
import { cinemasRoutes } from "./modules/cinemas/cinemas.routes.js";
import { createCinemasRepository } from "./modules/cinemas/cinemas.repository.js";
import { createCinemasService } from "./modules/cinemas/cinemas.service.js";
import { createCachedCitiesRepository } from "./modules/cities/cities.cache.js";
import { createCachedMoviesRepository } from "./modules/movies/movies.cache.js";
import { createMoviesSearch } from "./modules/movies/movies.search.js";
import { citiesRoutes } from "./modules/cities/cities.routes.js";
import { createCitiesRepository } from "./modules/cities/cities.repository.js";
import { createCitiesService } from "./modules/cities/cities.service.js";
import { healthRoutes } from "./modules/health/health.routes.js";
import { moviesRoutes } from "./modules/movies/movies.routes.js";
import { createMoviesRepository } from "./modules/movies/movies.repository.js";
import { createMoviesService } from "./modules/movies/movies.service.js";
import { showsRoutes } from "./modules/shows/shows.routes.js";
import { createShowsRepository } from "./modules/shows/shows.repository.js";
import { createShowsService } from "./modules/shows/shows.service.js";

/**
 * Composition root: the only place where repositories and services are wired together.
 */
export const registerRoutes = async (app: FastifyInstance): Promise<void> => {
  const { prisma, cache, searchEngine } = app;

  const cities = createCitiesService(
    createCachedCitiesRepository(createCitiesRepository(prisma), cache),
  );

  const moviesSearch = createMoviesSearch(searchEngine, app.log);
  app.addHook("onReady", () => moviesSearch.ensureIndex());
  const movies = createMoviesService(
    createCachedMoviesRepository(createMoviesRepository(prisma), cache),
    moviesSearch,
  );

  const cinemas = createCinemasService(createCinemasRepository(prisma), cities);
  const shows = createShowsService(createShowsRepository(prisma), movies, cinemas);

  await app.register(healthRoutes);

  await app.register(
    async (api) => {
      await api.register(citiesRoutes(cities), { prefix: "/cities" });
      await api.register(cinemasRoutes(cinemas), { prefix: "/cinemas" });
      await api.register(moviesRoutes(movies), { prefix: "/movies" });
      await api.register(showsRoutes(shows), { prefix: "/shows" });
    },
    { prefix: "/api/v1" },
  );
};
