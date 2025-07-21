// prisma.service.ts
import { Injectable } from "@nestjs/common";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

@Injectable()
export class RedisService {
  private readonly upstash = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });

  private readonly ratelimit = new Ratelimit({
    redis: this.upstash,
    limiter: Ratelimit.slidingWindow(10, "10 s"),
  });

  async get(key: string) {
    return await this.upstash.get(key);
  }

  async set(key: string, value: string) {
    return await this.upstash.set(key, value);
  }

  async del(key: string) {
    return await this.upstash.del(key);
  }

  async expire(key: string, seconds: number) {
    return await this.upstash.expire(key, seconds);
  }

  async ttl(key: string) {
    return await this.upstash.ttl(key);
  }

  async keys(pattern: string) {
    return await this.upstash.keys(pattern);
  }

  async scan(pattern: string) {
    return await this.upstash.scan(pattern);
  }

  async incrementWithExpiry(key: string, ttlSeconds: number): Promise<number> {
    const count = await this.upstash.incr(key);

    if (count === 1) {
      await this.upstash.expire(key, ttlSeconds);
    }

    return count;
  }

  async getIncrementedValue(key: string): Promise<number> {
    const count = await this.upstash.get(key);

    if (!count) {
      return 0;
    }

    const countNumber = parseInt(count as string) || 0;
    return countNumber;
  }
}
