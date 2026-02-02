import { Process, Processor } from "@nestjs/bull";

import { MailerService } from "@nestjs-modules/mailer";
import { type Job } from "bull";

import { SendEmailJobPayload } from "src/modules/email/email.interface";

import { BULL_CONSTANTS } from "../bull.constants";

@Processor(BULL_CONSTANTS.EMAIL_QUEUE)
export class EmailQueueProcessor {
  constructor(private readonly emailService: MailerService) {}
  @Process(BULL_CONSTANTS.EMAIL_JOB)
  async processEmail(emailJob: Job<SendEmailJobPayload>): Promise<void> {
    await this.emailService.sendMail(emailJob.data);
  }
}
