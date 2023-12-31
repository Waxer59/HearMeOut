import { Injectable, Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class CachingService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}
  async getCacheKey(key: string): Promise<string> {
    const value = await this.cacheManager.get(key);
    return value as string;
  }
  async setCacheKey(key: string, value: string): Promise<void> {
    await this.cacheManager.set(key, value);
  }
  async deleteCacheKey(key: string): Promise<void> {
    await this.cacheManager.del(key);
  }
  async resetCache(): Promise<void> {
    await this.cacheManager.reset();
  }
}
