/**
 * Simple in-memory cache module
 * Stores data with automatic expiration based on TTL
 */

const cache = {};

/**
 * Set a value in cache with TTL
 * @param {string} key - Cache key
 * @param {*} data - Data to cache
 * @param {number} ttlSeconds - Time to live in seconds
 */
export const set = (key, data, ttlSeconds) => {
  const expiry = Date.now() + ttlSeconds * 1000;
  cache[key] = { data, expiry };
};

/**
 * Get a value from cache
 * @param {string} key - Cache key
 * @returns {* | null} - Cached data if valid, null if expired or not found
 */
export const get = (key) => {
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
export const clear = () => {
  Object.keys(cache).forEach((key) => delete cache[key]);
};

/**
 * Get cache size
 * @returns {number} - Number of items in cache
 */
export const size = () => Object.keys(cache).length;

/**
 * Check if key exists and is not expired
 * @param {string} key - Cache key
 * @returns {boolean}
 */
export const has = (key) => get(key) !== null;
