import type { BullModuleOptions } from "@nestjs/bull";

import { BULL_CONSTANTS } from "../bull.constants";

export const emailQueue: BullModuleOptions = {
  name: BULL_CONSTANTS.EMAIL_QUEUE,
};
