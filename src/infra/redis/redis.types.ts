export interface CacheService {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttlSeconds?: number): Promise<void>;
  del(...keys: string[]): Promise<void>;
  /** Deletes every key that starts with `prefix`. */
  delByPrefix(prefix: string): Promise<void>;
  /** Cache-aside helper. `null`/`undefined` loader results are not cached. */
  getOrSet<T>(key: string, loader: () => Promise<T>, ttlSeconds?: number): Promise<T>;
}
