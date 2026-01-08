import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsBoolean } from 'class-validator';
import { userRoles } from 'src/user/user-types';

export class UpdateRoleDto {
  @ApiProperty({
    description: 'specify role you wish to be promoted to',
    example: 'admin',
  })
  @IsEnum(userRoles, {
    message: 'Role must be either admin, reader, or author',
  })
  role: userRoles;
}

export class processRoleApprovalRequestDto {
  @ApiProperty({
    description: 'Specify whethere you wish to approve or reject the reqeust',
    example: true,
  })
  @IsBoolean({
    message: 'Role approval status can not be empty',
  })
  isApproved: boolean;
}
