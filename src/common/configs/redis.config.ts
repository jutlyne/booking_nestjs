import { registerAs } from '@nestjs/config';
import { RedisConfig } from './config.interface';

export default registerAs<RedisConfig>('redis', () => {
  return {
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  };
});
