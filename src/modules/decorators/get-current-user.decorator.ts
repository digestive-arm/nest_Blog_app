import type { ExecutionContext } from "@nestjs/common";
import { createParamDecorator } from "@nestjs/common";

import type { RequestWithUser } from "src/common/interfaces/request-with-user.interface";

export const CurrentUser = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<RequestWithUser>();
    return request.user;
  },
);
