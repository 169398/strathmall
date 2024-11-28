import  redis  from "@/lib/redis";

interface CacheOptions {
  expirationTime?: number; // in seconds
  skipCache?: boolean;
}

export class CacheService {
  private static DEFAULT_EXPIRATION = 60 * 30; // 30 minutes

  static async getOrSet<T>(
    key: string,
    fetchFn: () => Promise<T>,
    options: CacheOptions = {}
  ): Promise<T> {
    const { expirationTime = this.DEFAULT_EXPIRATION, skipCache = false } =
      options;

    // Skip cache if specified
    if (skipCache) {
      return await fetchFn();
    }

    try {
      // Try to get from cache
      const cachedData = await redis.get(key);
      if (cachedData) {
        return JSON.parse(cachedData as string);
      }

      // If not in cache, fetch fresh data
      const freshData = await fetchFn();

      // Store in cache
      await redis.set(key, JSON.stringify(freshData), {
        ex: expirationTime,
      });

      return freshData;
    } catch (error) {
      console.error(`Cache error for ${key}:`, error);
      // Fallback to direct fetch on cache error
      return await fetchFn();
    }
  }

  static async invalidate(key: string): Promise<void> {
    await redis.del(key);
  }

  static async invalidatePattern(pattern: string): Promise<void> {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(keys[0]);
    }
  }
}
