import { loadConfig } from "../../src/bootstrap/config.js";
import { createPrismaClient } from "../../src/infra/database/prisma.client.js";
import { createEsClient } from "../../src/infra/elasticsearch/elasticsearch.client.js";
import { createElasticSearchService } from "../../src/infra/elasticsearch/search.service.js";
import { MOVIES_INDEX, moviesIndexMappings } from "../../src/modules/movies/movies.search.js";

// Rebuilds the movies search index from Postgres (the source of truth).
// Usage: npm run search:reindex
const BATCH_SIZE = 500;

const config = loadConfig();
if (!config.ELASTICSEARCH_ENABLED) {
  console.error("ELASTICSEARCH_ENABLED is not true. Nothing to reindex.");
  process.exit(1);
}

const prisma = createPrismaClient(config.DATABASE_URL);
const client = createEsClient(config);
const search = createElasticSearchService(client, config.ELASTICSEARCH_INDEX_PREFIX);

try {
  await search.ensureIndex(MOVIES_INDEX, moviesIndexMappings);
  const index = search.indexName(MOVIES_INDEX);

  let cursor: string | undefined;
  let total = 0;
  for (;;) {
    const movies = await prisma.movie.findMany({
      take: BATCH_SIZE,
      orderBy: { id: "asc" },
      ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
    });
    if (movies.length === 0) break;

    for (const movie of movies) {
      await search.indexDocument(index, movie.id, { ...movie });
    }
    total += movies.length;
    cursor = movies[movies.length - 1]!.id;
  }
  console.log(`Reindexed ${total} movies into ${index}.`);
} finally {
  await prisma.$disconnect();
  await client.close();
}
