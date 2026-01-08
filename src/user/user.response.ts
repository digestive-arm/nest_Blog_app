import { Expose } from 'class-transformer';
import { userRoles } from './user-types';
import { ApiPropertyWritable } from 'src/modules/swagger/swagger.writable.decorator';
import { PaginationMetaResponse } from 'src/common/responses/pagination.response';

export class UserResponse {
  @Expose()
  @ApiPropertyWritable({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;

  @Expose()
  @ApiPropertyWritable({ example: 'johndoe' })
  username: string;

  @Expose()
  @ApiPropertyWritable({ example: 'John' })
  firstname: string;

  @Expose()
  @ApiPropertyWritable({ example: 'Doe' })
  lastname: string;

  @Expose()
  @ApiPropertyWritable({ example: 'john@example.com' })
  email: string;

  @Expose()
  @ApiPropertyWritable({ enum: userRoles, example: userRoles.READER })
  role: userRoles;
}

export class FindAllUsersResponse {
  @Expose()
  @ApiPropertyWritable({ type: [UserResponse] })
  data: UserResponse[];

  @Expose()
  @ApiPropertyWritable({ type: PaginationMetaResponse })
  meta: PaginationMetaResponse;
}
