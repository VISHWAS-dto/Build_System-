import type { FastifyBaseLogger } from "fastify";
import type { SearchService } from "../../infra/elasticsearch/elasticsearch.types.js";
import type { Movie, MoviesSearch } from "./movies.types.js";

const INDEX = "movies";

export const MOVIES_INDEX = INDEX;

export const moviesIndexMappings = {
  properties: {
    id: { type: "keyword" },
    title: { type: "text" },
    language: { type: "keyword" },
    durationMin: { type: "integer" },
    createdAt: { type: "date" },
  },
};

export const createMoviesSearch = (
  search: SearchService,
  logger: FastifyBaseLogger,
): MoviesSearch => {
  const index = search.indexName(INDEX);

  return {
    async ensureIndex() {
      try {
        await search.ensureIndex(INDEX, moviesIndexMappings);
      } catch (err) {
        logger.warn({ err }, "could not ensure movies index");
      }
    },

    async index(movie) {
      try {
        await search.indexDocument(index, movie.id, { ...movie });
      } catch (err) {
        logger.warn({ err, movieId: movie.id }, "could not index movie");
      }
    },

    async search({ q, page, limit }) {
      const { hits, total } = await search.search<Movie>(index, {
        query: { match: { title: { query: q, fuzziness: "AUTO" } } },
        from: (page - 1) * limit,
        size: limit,
      });
      return { data: hits, total };
    },
  };
};
