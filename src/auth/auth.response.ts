import { Expose } from 'class-transformer';
import { ApiPropertyWritable } from './../modules/swagger/swagger.writable.decorator';
import { USER_ROLES } from 'src/user/user-types';

export class CurrentUserResponse {
  @ApiPropertyWritable({
    example: 'h14g5g23-fdsdfbd-23bdbf',
    description: 'user ID',
  })
  @Expose()
  id: string;

  @ApiPropertyWritable({
    example: 'example@gmail.com',
    description: 'email of current user',
  })
  @Expose()
  email: string;

  @ApiPropertyWritable({
    example: USER_ROLES.READER,
  })
  @Expose()
  role: USER_ROLES;
}
