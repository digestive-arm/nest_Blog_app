import { ApiProperty } from '@nestjs/swagger';
import { updateUserParams } from '../user-types';
import { IsNotEmpty, MinLength } from 'class-validator';

export class UpdateUserDto implements updateUserParams {
  @ApiProperty({
    example: 'john_doe',
    description: 'username you wish to have',
  })
  @MinLength(5, {
    message: 'Username must be longer than or equal to $constraint1 characters',
  })
  @IsNotEmpty()
  readonly username: string;

  @ApiProperty({
    example: 'john',
    description: 'Your firstname',
  })
  @IsNotEmpty()
  readonly firstname: string;

  @IsNotEmpty()
  @ApiProperty({
    example: 'doe',
    description: 'Your lastname',
  })
  readonly lastname: string;
}
