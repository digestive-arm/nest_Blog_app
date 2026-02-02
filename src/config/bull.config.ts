import type { BullRootModuleOptions } from "@nestjs/bull";

import { secretConfig } from "./env.config";

export const bullConfig: BullRootModuleOptions = {
  redis: {
    host: secretConfig.redisHost,
    port: Number(secretConfig.redisPort),
  },
};
