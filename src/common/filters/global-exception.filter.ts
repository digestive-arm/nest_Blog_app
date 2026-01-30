import { ExceptionFilter, Catch, ArgumentsHost } from "@nestjs/common";

import { Response } from "express";

import responseUtils from "src/utils/response.utils";

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  catch(exception, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    responseUtils.error({ res: response, error: exception });
  }
}
