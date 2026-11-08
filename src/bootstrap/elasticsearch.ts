import type { FastifyInstance } from "fastify";
import { createEsClient } from "../infra/elasticsearch/elasticsearch.client.js";
import type { SearchService } from "../infra/elasticsearch/elasticsearch.types.js";
import {
  createElasticSearchService,
  createNoopSearchService,
} from "../infra/elasticsearch/search.service.js";
import type { Config } from "./config.js";

declare module "fastify" {
  interface FastifyInstance {
    searchEngine: SearchService;
  }
}

export const initElasticsearch = (app: FastifyInstance, config: Config): void => {
  if (!config.ELASTICSEARCH_ENABLED) {
    app.decorate("searchEngine", createNoopSearchService(config.ELASTICSEARCH_INDEX_PREFIX));
    return;
  }

  const client = createEsClient(config);
  app.decorate(
    "searchEngine",
    createElasticSearchService(client, config.ELASTICSEARCH_INDEX_PREFIX),
  );
  app.addHook("onClose", async () => {
    await client.close();
  });
};
