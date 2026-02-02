import { InjectQueue } from "@nestjs/bull";
import { Injectable } from "@nestjs/common";

import { type Queue } from "bull";

import { SendEmailJobPayload } from "src/modules/email/email.interface";

import { BULL_CONSTANTS } from "../bull.constants";

@Injectable()
export class EmailJobProducer {
  constructor(
    @InjectQueue(BULL_CONSTANTS.EMAIL_QUEUE) private readonly emailQueue: Queue,
  ) {}

  async sendMail(payload: SendEmailJobPayload): Promise<void> {
    await this.emailQueue.add(BULL_CONSTANTS.EMAIL_JOB, payload, {
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 5000,
      },
      removeOnComplete: true,
      removeOnFail: false,
    });
  }
}
