import { PartialType } from '@nestjs/swagger';
import { CreateBlogpostDto } from './create-blogpost.dto';

export class UpdateBlogpostDto extends PartialType(CreateBlogpostDto) {}
