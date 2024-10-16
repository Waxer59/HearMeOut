import { Injectable, Inject, OnApplicationBootstrap } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class CachingService implements OnApplicationBootstrap {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}
  async getCacheKey<T>(key: string): Promise<T | null> {
    try {
      const value = await this.cacheManager.get(key);
      return value as T;
    } catch (error) {
      return null;
    }
  }
  async setCacheKey(key: string, value: unknown, ttl?: number): Promise<void> {
    try {
      await this.cacheManager.set(key, value, ttl);
    } catch (error) {}
  }
  async deleteCacheKey(key: string): Promise<void> {
    try {
      await this.cacheManager.del(key);
    } catch (error) {}
  }
  async resetCache(): Promise<void> {
    try {
      await this.cacheManager.reset();
    } catch (error) {}
  }
  async onApplicationBootstrap(): Promise<void> {
    // Reset the cache on bootstrap
    // to avoid unexpected behaviour
    await this.resetCache();
  }
}
