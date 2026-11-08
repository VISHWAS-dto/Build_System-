import { Client } from "@elastic/elasticsearch";
import type { Config } from "../../bootstrap/config.js";

export const createEsClient = (config: Config): Client =>
  new Client({
    node: config.ELASTICSEARCH_NODE,
    ...(config.ELASTICSEARCH_USERNAME && config.ELASTICSEARCH_PASSWORD
      ? {
          auth: {
            username: config.ELASTICSEARCH_USERNAME,
            password: config.ELASTICSEARCH_PASSWORD,
          },
        }
      : {}),
  });
