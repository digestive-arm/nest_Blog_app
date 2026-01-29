import { Exclude, Expose, Type } from "class-transformer";

import { PaginationMetaResponse } from "src/common/responses/pagination.response";
import { RoleApprovalStatus } from "src/modules/database/entities/role-management.entity";
import { ApiPropertyWritable } from "src/modules/swagger/swagger.writable.decorator";
import { USER_ROLES } from "src/user/user-types";

export class MyRequestsResponse {
  @Expose()
  @ApiPropertyWritable()
  id: string;

  @Exclude()
  @ApiPropertyWritable()
  userId: string;

  @Expose()
  @ApiPropertyWritable()
  status: RoleApprovalStatus;

  @Expose()
  @ApiPropertyWritable()
  requestedRole: USER_ROLES;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;

  @Exclude()
  deletedAt: Date;
}

export class PendingRequestsResponse {
  @Expose()
  @ApiPropertyWritable()
  id: string;

  @Expose()
  @ApiPropertyWritable()
  userId: string;

  @Expose()
  @ApiPropertyWritable()
  requestedRole: USER_ROLES;
}

export class GetAllPendingRequestResponse {
  @ApiPropertyWritable({
    type: [PendingRequestsResponse],
  })
  @Expose()
  @Type(() => PendingRequestsResponse)
  data: PendingRequestsResponse[];
  @ApiPropertyWritable({
    type: PaginationMetaResponse,
  })
  @Expose()
  @Type(() => PaginationMetaResponse)
  meta: PaginationMetaResponse;
}
