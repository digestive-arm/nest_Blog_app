import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntity } from 'src/modules/database/entities/category.entity';
import { BlogpostEntity } from 'src/modules/database/entities/blogpost.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryEntity, BlogpostEntity])],
  controllers: [CategoryController],
  providers: [CategoryService, CategoryEntity, BlogpostEntity],
  exports: [CategoryService, CategoryEntity],
})
export class CategoryModule {}
