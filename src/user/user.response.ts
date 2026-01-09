import { Exclude, Expose, Type } from 'class-transformer';
import { userRoles } from './user-types';
import { ApiPropertyWritable } from 'src/modules/swagger/swagger.writable.decorator';
import { PaginationMetaResponse } from 'src/common/responses/pagination.response';
import { RoleApproval } from 'src/role-management/entities/role-management.entity';
import { BlogpostEntity } from 'src/blogpost/entities/blogpost.entity';

export class UserResponse {
  @Expose()
  @ApiPropertyWritable({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;

  @Expose()
  @ApiPropertyWritable({ example: 'johndoe' })
  userName: string;

  @Expose()
  @ApiPropertyWritable({ example: 'John' })
  firstName: string;

  @Expose()
  @ApiPropertyWritable({ example: 'Doe' })
  lastName: string;

  @Expose()
  @ApiPropertyWritable({ example: 'john@example.com' })
  email: string;

  @Expose()
  @ApiPropertyWritable({ enum: userRoles, example: userRoles.READER })
  role: userRoles;

  @Exclude()
  password: string;

  @Exclude()
  isActive: boolean;

  @Exclude()
  refreshToken: string;

  @Exclude()
  roleRequest: RoleApproval[];

  @Exclude()
  blogPosts: BlogpostEntity[];

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;
}

export class FindAllUsersResponse {
  @Expose()
  @ApiPropertyWritable({ type: [UserResponse] })
  data: UserResponse[];

  @Expose()
  @ApiPropertyWritable({ type: PaginationMetaResponse })
  @Type(() => PaginationMetaResponse)
  meta: PaginationMetaResponse;
}
