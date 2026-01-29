import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { CategoryEntity } from "src/modules/database/entities/category.entity";
import { UserEntity } from "src/modules/database/entities/user.entity";
import { AuthGuard } from "src/modules/guards/auth.guard";

import { CategoryController } from "./category.controller";
import { CategoryService } from "./category.service";

@Module({
  imports: [TypeOrmModule.forFeature([CategoryEntity, UserEntity])],
  controllers: [CategoryController],
  providers: [CategoryService, CategoryEntity, AuthGuard],
  exports: [CategoryService, CategoryEntity],
})
export class CategoryModule {}
