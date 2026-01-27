import { Injectable, OnModuleInit } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";

import { BlogpostService } from "src/blogpost/blogpost.service";

@Injectable()
export class CronService {
  constructor(private readonly blogPostService: BlogpostService) {}
  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  cleanupSoftDeletedRecords() {
    return this.blogPostService.cleanupSoftDeleteRecords();
  }
}
