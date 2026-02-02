import { BullModule } from "@nestjs/bull";
import { Module } from "@nestjs/common";
import { ScheduleModule } from "@nestjs/schedule";

import { MailerModule } from "@nestjs-modules/mailer";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { BlogpostModule } from "./blogpost/blogpost.module";
import { CategoryModule } from "./category/category.module";
import { CommentsModule } from "./comments/comments.module";
import { bullConfig } from "./config/bull.config";
import transportConfig from "./config/transport.config";
import { DashboardModule } from "./dashboard/dashboard.module";
import { CronModule } from "./modules/cron/cron.module";
import { DatabaseModule } from "./modules/database/database.module";
import { EmailModule } from "./modules/email/email.module";
import { RoleManagementModule } from "./role-management/role-management.module";
import { UploadsModule } from "./uploads/uploads.module";
import { UserModule } from "./user/user.module";

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
    MailerModule.forRoot(transportConfig),
    CronModule,
    BullModule.forRoot(bullConfig),
    EmailModule,
    DashboardModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
