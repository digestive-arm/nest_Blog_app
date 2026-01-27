import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { BlogpostEntity } from "src/modules/database/entities/blogpost.entity";
import { CategoryEntity } from "src/modules/database/entities/category.entity";
import { UserEntity } from "src/modules/database/entities/user.entity";
import { AuthGuard } from "src/modules/guards/auth.guard";
import { AuthUtils } from "src/utils/auth.utils";

import { CategoryController } from "./category.controller";
import { CategoryService } from "./category.service";

@Module({
  imports: [TypeOrmModule.forFeature([CategoryEntity, UserEntity])],
  controllers: [CategoryController],
  providers: [CategoryService, CategoryEntity, AuthGuard, AuthUtils],
  exports: [CategoryService, CategoryEntity],
})
export class CategoryModule {}
