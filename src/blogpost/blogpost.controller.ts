import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BlogpostService } from './blogpost.service';
import { CreateBlogpostDto } from './dto/create-blogpost.dto';
import { UpdateBlogpostDto } from './dto/update-blogpost.dto';

@Controller('blogpost')
export class BlogpostController {
  constructor(private readonly blogpostService: BlogpostService) {}

  @Post()
  create(@Body() createBlogpostDto: CreateBlogpostDto) {
    return this.blogpostService.create(createBlogpostDto);
  }

  @Get()
  findAll() {
    return this.blogpostService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.blogpostService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBlogpostDto: UpdateBlogpostDto) {
    return this.blogpostService.update(+id, updateBlogpostDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.blogpostService.remove(+id);
  }
}
