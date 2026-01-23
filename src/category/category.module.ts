import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntity } from 'src/modules/database/entities/category.entity';
import { BlogpostEntity } from 'src/modules/database/entities/blogpost.entity';
import { AuthGuard } from 'src/modules/guards/auth.guard';
import { AuthUtils } from 'src/utils/auth.utils';
import { UserEntity } from 'src/modules/database/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryEntity, UserEntity])],
  controllers: [CategoryController],
  providers: [CategoryService, CategoryEntity, AuthGuard, AuthUtils],
  exports: [CategoryService, CategoryEntity],
})
export class CategoryModule {}
