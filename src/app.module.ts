import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { DatabaseModule } from './modules/database/database.module';
import { RoleManagementModule } from './role-management/role-management.module';
import { BlogpostModule } from './blogpost/blogpost.module';
import { CategoryModule } from './category/category.module';
import { UploadsModule } from './uploads/uploads.module';
import { CommentsModule } from './comments/comments.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CronModule } from './modules/cron/cron.module';
@Module({
  imports: [
    AuthModule,
    UserModule,
    DatabaseModule,
    RoleManagementModule,
    BlogpostModule,
    CategoryModule,
    UploadsModule,
    CommentsModule,
    ScheduleModule.forRoot(),
    CronModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
