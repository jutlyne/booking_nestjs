import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { Services } from '../constants/common';

@Module({
  providers: [
    {
      provide: Services.REDIS,
      useClass: RedisService,
    },
  ],
  exports: [
    {
      provide: Services.REDIS,
      useClass: RedisService,
    },
  ],
})
export class RedisModule {}
