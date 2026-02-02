import { HttpException, HttpStatus } from "@nestjs/common";

import type { ClassConstructor } from "class-transformer";
import type { Response } from "express";
import type { StatusCodes } from "http-status-codes";

export interface CommonResponseType<T> {
  data: T | T[];
  status?: number;
  transformWith?: ClassConstructor<unknown>;
}
interface ErrorResponseType {
  res: Response;
  error: AnyType;
  additionalErrors?: Array<{ row: number; errorMessages: string[] }>;
  statusCode?: StatusCodes;
}
function normalizeException(error: unknown): {
  statusCode: number;
  message: string;
  errors?: { field?: string; message: string }[];
} {
  if (error instanceof HttpException) {
    const response = error.getResponse();

    if (typeof response === "string") {
      return {
        statusCode: error.getStatus(),
        message: response,
      };
    }

    if (typeof response === "object") {
      const res = response as any;

      // class-validator errors
      if (Array.isArray(res.message)) {
        return {
          statusCode: error.getStatus(),
          message: "Validation failed",
          errors: res.message.map((msg: string) => ({
            message: msg,
          })),
        };
      }

      return {
        statusCode: error.getStatus(),
        message: res.message ?? "Request failed",
      };
    }
  }

  // Unknown / system errors
  return {
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    message: "Internal server error",
  };
}

export function messageResponse(message: string) {
  return { message };
}
class ResponseUtils {
  public error({ res, error }: ErrorResponseType) {
    const normalized = normalizeException(error);

    return res.status(normalized.statusCode).send({
      statusCode: normalized.statusCode,
      message: normalized.message,
      errors: normalized.errors,
    });
  }
}
export default new ResponseUtils();
