import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class PaginationDto {
  @ApiProperty()
  @IsNotEmpty()
  page: string;

  @ApiProperty()
  @IsNotEmpty()
  limit: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  @Transform((value) => Boolean(value))
  isPagination: boolean;
}
