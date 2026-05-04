/**
 * Simple in-memory cache module
 * Stores data with automatic expiration based on TTL
 */

interface CacheEntry {
  data: unknown;
  expiry: number;
}

const cache: Record<string, CacheEntry> = {};

/**
 * Set a value in cache with TTL
 */
export const set = (key: string, data: unknown, ttlSeconds: number): void => {
  const expiry = Date.now() + ttlSeconds * 1000;
  cache[key] = { data, expiry };
};

/**
 * Get a value from cache
 */
export const get = (key: string): unknown | null => {
  if (!(key in cache)) {
    return null;
  }

  const { data, expiry } = cache[key];

  if (Date.now() > expiry) {
    delete cache[key];
    return null;
  }

  return data;
};

/**
 * Clear all cache
 */
export const clear = (): void => {
  Object.keys(cache).forEach((key) => delete cache[key]);
};

/**
 * Get cache size
 */
export const size = (): number => Object.keys(cache).length;

/**
 * Check if key exists and is not expired
 */
export const has = (key: string): boolean => get(key) !== null;
