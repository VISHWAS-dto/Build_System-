export interface SearchHits<T> {
  hits: T[];
  total: number;
}

export interface SearchRequest {
  /** Elasticsearch query DSL. */
  query: Record<string, unknown>;
  from?: number;
  size?: number;
}

export interface SearchService {
  readonly enabled: boolean;
  ping(): Promise<boolean>;
  /** Creates the index if it does not exist yet. */
  ensureIndex(name: string, mappings: Record<string, unknown>): Promise<void>;
  indexDocument(index: string, id: string, document: Record<string, unknown>): Promise<void>;
  deleteDocument(index: string, id: string): Promise<void>;
  search<T>(index: string, request: SearchRequest): Promise<SearchHits<T>>;
  /** Full index name with the environment prefix applied. */
  indexName(name: string): string;
}
