import { Exclude, Expose } from 'class-transformer';
import { RoleApprovalStatus } from 'src/entities/role-approval.entity';
import { ApiPropertyWritable } from 'src/modules/swagger/swagger.writable.decorator';
import { userRoles } from 'src/user/user-types';

export class MyRequestsResponse {
  @Expose()
  @ApiPropertyWritable()
  id: string;

  @Expose()
  @ApiPropertyWritable()
  status: RoleApprovalStatus;

  @Expose()
  @ApiPropertyWritable()
  requestedRole: userRoles;

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
  requestedRole: userRoles;

  @Exclude()
  @ApiPropertyWritable()
  status: RoleApprovalStatus;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;

  @Exclude()
  deletedAt: Date;
}
