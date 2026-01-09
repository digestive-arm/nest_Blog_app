import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsBoolean, IsNotEmpty } from 'class-validator';
import { TrimString } from '../../modules/decorators/trim-string.decorator';
import { userRoles } from '../../user/user-types';

export class UpdateRoleDto {
  @ApiProperty({
    description: 'specify role you wish to be promoted to',
    example: 'admin',
  })
  @IsEnum(userRoles, {
    message: 'Role must be either admin, reader, or author',
  })
  @IsNotEmpty()
  @TrimString()
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
  @IsNotEmpty()
  isApproved: boolean;
}
