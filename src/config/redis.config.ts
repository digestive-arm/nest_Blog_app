import type { CacheModuleAsyncOptions } from "@nestjs/cache-manager";

import KeyvRedis from "@keyv/redis";

import { secretConfig } from "./env.config";

export const redisConfig: CacheModuleAsyncOptions = {
  isGlobal: true,
  useFactory: () => ({
    stores: new KeyvRedis({
      url: secretConfig.redisUrl,
    }),
    ttl: Number(secretConfig.redisTTL),
  }),
};
