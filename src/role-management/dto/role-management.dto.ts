import { ApiProperty } from "@nestjs/swagger";

import { IsEnum, IsBoolean, IsNotEmpty } from "class-validator";

import { TrimString } from "../../modules/decorators/trim-string.decorator";
import { USER_ROLES } from "../../user/user-types";

export class UpdateRoleDto {
  @ApiProperty({
    description: "specify role you wish to be promoted to",
    example: "admin",
  })
  @IsEnum(USER_ROLES, {
    message: "Role must be either admin, reader, or author",
  })
  @IsNotEmpty()
  @TrimString()
  role: USER_ROLES;
}

export class processRoleApprovalRequestDto {
  @ApiProperty({
    description: "Specify whether you wish to approve or reject the request",
    example: true,
  })
  @IsBoolean({
    message: "Role approval status can not be empty",
  })
  @IsNotEmpty()
  isApproved: boolean;
}
