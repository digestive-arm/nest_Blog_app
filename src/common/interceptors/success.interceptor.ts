import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";

import { plainToInstance } from "class-transformer";
import { Response } from "express";
import { map, Observable } from "rxjs";

import { TRANSFORM_KEY } from "src/modules/decorators/response-transformer.decorator";

@Injectable()
export class SuccessInterceptor implements NestInterceptor {
  constructor(private reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const transformWith = this.reflector.get(
      TRANSFORM_KEY,
      context.getHandler(),
    );

    return next.handle().pipe(
      map((data) => {
        // avoid double-wrapping
        if (
          data &&
          typeof data === "object" &&
          "data" in data &&
          "status" in data
        ) {
          return data;
        }

        const response = context.switchToHttp().getResponse<Response>();
        const statusCode = response.statusCode ?? 200;

        let responseData = data;
        if (transformWith) {
          responseData = plainToInstance(transformWith, data, {
            excludeExtraneousValues: true,
          });
        }

        return {
          data: responseData,
          status: statusCode,
        };
      }),
    );
  }
}
