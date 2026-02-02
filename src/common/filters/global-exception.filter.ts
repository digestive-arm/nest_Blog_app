import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  Logger,
  HttpException,
} from "@nestjs/common";

import { Response } from "express";

import responseUtils from "src/utils/response.utils";

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const logger = new Logger();
    // log only non-HttpExceptions
    if (!(exception instanceof HttpException)) {
      logger.error(exception);
    }

    responseUtils.error({ res: response, error: exception });
  }
}
