import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { updateUserParams } from '../user-types';
import { IsNotEmpty, IsOptional, MinLength } from 'class-validator';
import { TrimString } from 'src/modules/decorators/trim-string.decorator';

export class UpdateUserDto implements updateUserParams {
  @ApiPropertyOptional({
    example: 'john_doe',
    description: 'username you wish to have',
  })
  @MinLength(5, {
    message: 'Username must be longer than or equal to $constraint1 characters',
  })
  @IsOptional()
  @TrimString()
  readonly userName: string;

  @ApiPropertyOptional({
    example: 'john',
    description: 'Your firstname',
  })
  @IsOptional()
  @TrimString()
  readonly firstName: string;

  @ApiPropertyOptional({
    example: 'doe',
    description: 'Your lastname',
  })
  @IsOptional()
  @TrimString()
  readonly lastName: string;
}
