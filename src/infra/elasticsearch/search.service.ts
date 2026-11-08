import type { Client } from "@elastic/elasticsearch";
import { ServiceUnavailableError } from "../../common/errors/index.js";
import type { SearchHits, SearchRequest, SearchService } from "./elasticsearch.types.js";

export const createElasticSearchService = (client: Client, indexPrefix: string): SearchService => ({
  enabled: true,

  indexName: (name) => `${indexPrefix}_${name}`,

  async ping() {
    try {
      return await client.ping();
    } catch {
      return false;
    }
  },

  async ensureIndex(name, mappings) {
    const index = `${indexPrefix}_${name}`;
    if (!(await client.indices.exists({ index }))) {
      await client.indices.create({ index, mappings });
    }
  },

  async indexDocument(index, id, document) {
    await client.index({ index, id, document });
  },

  async deleteDocument(index, id) {
    await client.delete({ index, id }, { ignore: [404] });
  },

  async search<T>(index: string, { query, from = 0, size = 20 }: SearchRequest) {
    const res = await client.search<T>({ index, query, from, size });
    const total =
      typeof res.hits.total === "number" ? res.hits.total : (res.hits.total?.value ?? 0);
    const hits = res.hits.hits.flatMap((h) => (h._source ? [h._source] : []));
    return { hits, total } satisfies SearchHits<T>;
  },
});

/** Used when Elasticsearch is disabled: writes are ignored, searches report 503. */
export const createNoopSearchService = (indexPrefix: string): SearchService => ({
  enabled: false,
  indexName: (name) => `${indexPrefix}_${name}`,
  ping: async () => true,
  ensureIndex: async () => {},
  indexDocument: async () => {},
  deleteDocument: async () => {},
  search: async () => {
    throw new ServiceUnavailableError("Search is not enabled", "SEARCH_UNAVAILABLE");
  },
});
