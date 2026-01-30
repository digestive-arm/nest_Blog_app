import { Expose } from "class-transformer";

import { USER_ROLES } from "src/user/user-types";

import { ApiPropertyWritable } from "./../modules/swagger/swagger.writable.decorator";

export class CurrentUserResponse {
  @ApiPropertyWritable({
    example: "userId",
    description: "user ID",
  })
  @Expose()
  id: string;

  @ApiPropertyWritable({
    example: "example@gmail.com",
    description: "email of current user",
  })
  @Expose()
  email: string;

  @ApiPropertyWritable({
    example: USER_ROLES.READER,
  })
  @Expose()
  role: USER_ROLES;
}
