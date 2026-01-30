import { SetMetadata } from '@nestjs/common';
import { ClassConstructor } from 'class-transformer';

export const TRANSFORM_KEY = 'transform_with';
export const TransformWith = (dto: ClassConstructor<any>) =>
  SetMetadata(TRANSFORM_KEY, dto);
