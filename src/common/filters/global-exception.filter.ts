import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from "@nestjs/common";

import { Response } from "express";

import { logger } from "src/modules/logger/logger.service";
import responseUtils from "src/utils/response.utils";

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // log only non-HttpExceptions
    if (!(exception instanceof HttpException)) {
      logger.error("EXCEPTION FILTER:: Exception:", exception);
    }

    responseUtils.error({ res: response, error: exception });
  }
}
