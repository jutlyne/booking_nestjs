import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Redis } from '@upstash/redis';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from '@/common/configs/config.interface';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private redisClient: Redis;

  constructor(private readonly configService: ConfigService<AllConfigType>) {}

  onModuleInit() {
    // const url = this.configService.getOrThrow('redis.url', { infer: true });
    // const token = this.configService.getOrThrow('redis.token', { infer: true });

    // if (!url || !token) {
    //   throw new Error('Redis URL or Token not defined in config!');
    // }

    this.redisClient = Redis.fromEnv();
  }

  onModuleDestroy() {}

  async set<T = unknown>(key: string, value: T, ttlSeconds?: number) {
    const stringValue =
      typeof value === 'string' ? value : JSON.stringify(value);
    if (ttlSeconds) {
      return this.redisClient.set(key, stringValue, { ex: ttlSeconds });
    }
    return this.redisClient.set(key, stringValue);
  }

  async get<T = unknown>(key: string): Promise<T | null> {
    const data = await this.redisClient.get<string>(key);
    if (!data) return null;
    try {
      return JSON.parse(data) as T;
    } catch {
      return data as unknown as T;
    }
  }

  async del(key: string) {
    return this.redisClient.del(key);
  }

  getClient() {
    return this.redisClient;
  }
}
