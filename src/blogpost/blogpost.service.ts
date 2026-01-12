import { Injectable } from '@nestjs/common';
import { CreateBlogpostDto } from './dto/create-blogpost.dto';
import { UpdateBlogpostDto } from './dto/update-blogpost.dto';

@Injectable()
export class BlogpostService {
  create(createBlogpostDto: CreateBlogpostDto) {
    return 'This action adds a new blogpost';
  }

  findAll() {
    return `This action returns all blogpost`;
  }

  findOne(id: number) {
    return `This action returns a #${id} blogpost`;
  }

  update(id: number, updateBlogpostDto: UpdateBlogpostDto) {
    return `This action updates a #${id} blogpost`;
  }

  remove(id: number) {
    return `This action removes a #${id} blogpost`;
  }
}
