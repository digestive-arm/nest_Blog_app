import { ApiProperty } from "@nestjs/swagger";

import { Expose } from "class-transformer";

import { ApiPropertyWritable } from "../swagger.writable.decorator";

export class ResponseDto<TData = null> {
  @ApiProperty()
  status: number;

  @ApiProperty()
  data: TData;
}

export enum ResponseDtoTypeEnum {
  Array = "array",
  Object = "object",
}

export class MessageResponse {
  @Expose()
  @ApiPropertyWritable()
  message: string;
}

export class BaseResponse {
  @ApiPropertyWritable()
  id: string;

  @ApiPropertyWritable()
  createdAt: Date;

  @ApiPropertyWritable()
  updatedAt: Date;
}
