import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { BlogpostEntity } from "src/modules/database/entities/blogpost.entity";
import { CategoryEntity } from "src/modules/database/entities/category.entity";
import { CommentEntity } from "src/modules/database/entities/comment.entity";
import { UserEntity } from "src/modules/database/entities/user.entity";

import { AdminDashboardController } from "./admin/admin-dashboard.controller";
import { AdminDashboardService } from "./admin/admin-dashboard.service";
import { AuthorDashboardController } from "./author/author-dashboard.controller";
import { AuthorDashboardService } from "./author/author-dashboard.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      BlogpostEntity,
      CommentEntity,
      CategoryEntity,
    ]),
  ],
  controllers: [AdminDashboardController, AuthorDashboardController],
  providers: [AdminDashboardService, AuthorDashboardService],
})
export class DashboardModule {}
